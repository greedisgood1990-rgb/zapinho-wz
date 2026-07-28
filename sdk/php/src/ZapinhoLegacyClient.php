<?php
/**
 * Cliente HTTP para a Zapinho API V2 (NestJS).
 * Compatível com o formato de chamadas da V1.
 */
class ZapinhoClient
{
    private $baseUrl;
    private $apiKey;
    private $timeout;
    private $sessionMap = null;

    public function __construct($baseUrl, $apiKey, $timeout = 35)
    {
        $this->baseUrl = rtrim((string)$baseUrl, '/');
        $this->apiKey = trim((string)$apiKey);
        $this->timeout = max(5, (int)$timeout);
    }

    public function isConfigured()
    {
        return $this->baseUrl !== '' && $this->apiKey !== '';
    }

    private function resolveSessionId($sessionIdOrName)
    {
        if (preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i', $sessionIdOrName)) {
            return $sessionIdOrName;
        }
        if ($this->sessionMap === null) {
            $this->sessionMap = [];
            try {
                $sessions = $this->request('GET', '/api/sessions');
                if (is_array($sessions)) {
                    foreach ($sessions as $session) {
                        if (isset($session['name']) && isset($session['id'])) {
                            $this->sessionMap[$session['name']] = $session['id'];
                        }
                    }
                }
            } catch (Throwable $e) {}
        }
        if (isset($this->sessionMap[$sessionIdOrName])) {
            return $this->sessionMap[$sessionIdOrName];
        }
        return $sessionIdOrName;
    }

    public function health()
    {
        return $this->request('GET', '/api/health', null, false);
    }

    public function listSessions()
    {
        return $this->request('GET', '/api/sessions');
    }

    public function startSession($sessionId)
    {
        $uuid = $this->resolveSessionId($sessionId);
        if ($uuid === $sessionId && !preg_match('/^[0-9a-f]{8}-/i', $uuid)) {
            try {
                $createRes = $this->request('POST', '/api/sessions', ['name' => $sessionId]);
                if (isset($createRes['id'])) {
                    $uuid = $createRes['id'];
                    if ($this->sessionMap !== null) $this->sessionMap[$sessionId] = $uuid;
                }
            } catch (Throwable $e) {}
            if ($uuid === $sessionId && !preg_match('/^[0-9a-f]{8}-/i', $uuid)) {
                $this->sessionMap = null;
                $uuid = $this->resolveSessionId($sessionId);
                if ($uuid === $sessionId && !preg_match('/^[0-9a-f]{8}-/i', $uuid)) {
                    throw new RuntimeException("Falha ao criar ou encontrar a sessão na API V2.");
                }
            }
        }
        return $this->request('POST', '/api/sessions/' . rawurlencode($uuid) . '/start');
    }

    public function getSession($sessionId)
    {
        return $this->request('GET', '/api/sessions/' . rawurlencode($this->resolveSessionId($sessionId)));
    }

    public function getQr($sessionId)
    {
        return $this->request('GET', '/api/sessions/' . rawurlencode($this->resolveSessionId($sessionId)) . '/qr');
    }

    public function pairingCode($sessionId, $phoneNumber)
    {
        return $this->request('POST', '/api/sessions/' . rawurlencode($this->resolveSessionId($sessionId)) . '/pairing-code', [
            'phoneNumber' => $phoneNumber,
        ], true, 45);
    }

    public function deleteSession($sessionId)
    {
        $uuid = $this->resolveSessionId($sessionId);
        if ($uuid === $sessionId && !preg_match('/^[0-9a-f]{8}-/i', $uuid)) {
            if ($this->sessionMap !== null && isset($this->sessionMap[$sessionId])) {
                unset($this->sessionMap[$sessionId]);
            }
            return ['status' => 'success', 'message' => 'Session already deleted or not found.'];
        }
        $res = $this->request('DELETE', '/api/sessions/' . rawurlencode($uuid));
        if ($this->sessionMap !== null && isset($this->sessionMap[$sessionId])) {
            unset($this->sessionMap[$sessionId]);
        }
        return $res;
    }

    public function sendText($sessionId, $to, $body)
    {
        return $this->request('POST', '/api/sessions/' . rawurlencode($this->resolveSessionId($sessionId)) . '/messages/send-text', [
            'chatId' => (strpos($to, '@') === false ? $to . '@c.us' : $to),
            'text' => $body,
        ], true, 45);
    }

    public function sendMediaUrl($sessionId, $to, $type, $url, $filename, $mimetype, $caption = '')
    {
        $payload = [
            'chatId' => (strpos($to, '@') === false ? $to . '@c.us' : $to),
            'url' => $url,
            'mimetype' => $mimetype,
            'filename' => $filename,
        ];
        if ($caption !== '') $payload['caption'] = $caption;
        
        $endpoint = '/send-document';
        if ($type === 'image') $endpoint = '/send-image';
        elseif ($type === 'video') $endpoint = '/send-video';
        elseif ($type === 'audio') $endpoint = '/send-audio';

        return $this->request('POST', '/api/sessions/' . rawurlencode($this->resolveSessionId($sessionId)) . '/messages' . $endpoint, $payload, true, 120);
    }

    public function sendMediaBase64($sessionId, $to, $type, $base64, $filename, $mimetype, $caption = '')
    {
        $payload = [
            'chatId' => (strpos($to, '@') === false ? $to . '@c.us' : $to),
            'base64' => $base64,
            'mimetype' => $mimetype,
            'filename' => $filename,
        ];
        if ($caption !== '') $payload['caption'] = $caption;
        
        $endpoint = '/send-document';
        if ($type === 'image') $endpoint = '/send-image';
        elseif ($type === 'video') $endpoint = '/send-video';
        elseif ($type === 'audio') $endpoint = '/send-audio';

        return $this->request('POST', '/api/sessions/' . rawurlencode($this->resolveSessionId($sessionId)) . '/messages' . $endpoint, $payload, true, 120);
    }

    public function request($method, $path, $payload = null, $authenticated = true, $timeout = null)
    {
        if (!function_exists('curl_init')) {
            throw new RuntimeException('A extensão cURL do PHP não está instalada.');
        }
        if ($authenticated && !$this->isConfigured()) {
            throw new RuntimeException('Zapinho API ainda não configurada.');
        }

        $url = $this->baseUrl . '/' . ltrim($path, '/');
        $ch = curl_init($url);
        $headers = ['Accept: application/json'];
        if ($authenticated) {
            $headers[] = 'x-api-key: ' . $this->apiKey;
        }

        $method = strtoupper($method);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 8);
        curl_setopt($ch, CURLOPT_TIMEOUT, $timeout !== null ? (int)$timeout : $this->timeout);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, false);
        curl_setopt($ch, CURLOPT_MAXREDIRS, 0);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

        if ($payload !== null) {
            $json = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            if ($json === false) {
                throw new RuntimeException('Falha ao montar a requisição JSON.');
            }
            $headers[] = 'Content-Type: application/json';
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $json);
        }

        $raw = curl_exec($ch);
        $errno = curl_errno($ch);
        $error = curl_error($ch);
        $httpCode = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($errno) {
            throw new RuntimeException('Falha de conexão com a Zapinho API: ' . $error);
        }

        $decoded = json_decode((string)$raw, true);
        if (!is_array($decoded)) {
            $decoded = ['raw' => (string)$raw];
        }

        if ($httpCode < 200 || $httpCode >= 300) {
            $message = isset($decoded['message']) ? $decoded['message'] : (isset($decoded['error']) ? $decoded['error'] : 'Erro HTTP ' . $httpCode);
            throw new RuntimeException((string)$message, $httpCode);
        }

        return $decoded;
    }
}
