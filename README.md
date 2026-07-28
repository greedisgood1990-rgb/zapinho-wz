<p align="center">
  <img src="docs/logo/openwa_logo.webp" alt="Zapinho WZ Logo" width="180"/>
</p>

<h1 align="center">Zapinho WZ</h1>
<p align="center">
  <strong>API de WhatsApp Self-Hosted & IA Chatbot Engine</strong><br/>
  <em>Plataforma completa open-source para automação de WhatsApp, envio de mensagens e atendimento inteligente com IA (Google Gemini).</em>
</p>

<p align="center">
  <a href="#-recursos-principais">Recursos</a> •
  <a href="#-arquitetura-unificada">Arquitetura</a> •
  <a href="#-instalação-e-uso">Instalação</a> •
  <a href="#-módulo-de-ia-chatbot">IA Chatbot</a> •
  <a href="#-documentação-da-api">Endpoints API</a> •
  <a href="#-licença-e-créditos">Licença</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License"/>
  <img src="https://img.shields.io/badge/node-22_LTS-brightgreen.svg" alt="Node"/>
  <img src="https://img.shields.io/badge/docker-ready-blue.svg" alt="Docker"/>
  <img src="https://img.shields.io/badge/AI-Google_Gemini-orange.svg" alt="Gemini AI"/>
</p>

---

## 🚀 Sobre o Zapinho WZ

O **Zapinho WZ** é uma solução completa de comunicação automatizada via WhatsApp. Ele combina uma robusta **API REST de mensagens multi-sessão** com um motor de **IA Chatbot (Google Gemini)** e um criador visual de fluxos de conversa (**Flow Builder**).

Construído com foco em alta disponibilidade e baixo consumo de recursos, o Zapinho WZ permite gerenciar múltiplas conexões do WhatsApp simultaneamente, integrar via Webhooks, automatizar conversas complexas e oferecer um painel administrativo intuitivo.

---

## ✨ Recursos Principais

| Recurso | Descrição |
| :--- | :--- |
| 💬 **Multi-Sessão WhatsApp** | Gerencie dezenas de contas de WhatsApp em uma única instância com isolamento completo. |
| 🤖 **IA Chatbot (Gemini AI)** | Atendimento automatizado com inteligência artificial, processamento de linguagem natural e modelos generativos. |
| 🎨 **Flow Builder Visual** | Editor visual de fluxos conversacionais para personalizar respostas, captura de dados e formulários. |
| ⚡ **Motores Híbridos** | Escolha entre `whatsapp-web.js` (navegador Chromium de alta segurança) e `baileys` (protocolo leve de baixa memória). |
| 🖥️ **Painel Administrativo** | Dashboard completo em React para gestão de QR Codes, sessões, chaves de API, webhooks e logs. |
| 🔔 **Webhooks em Tempo Real** | Receba notificações instantâneas de mensagens recebidas, alterações de status e eventos com assinatura HMAC. |
| 🔌 **Plugins & Integrações** | Integração simplificada com **n8n**, **Typebot**, **Chatwoot** e sistemas legados PHP/Node.js. |
| 🐳 **Suporte Docker Native** | Imagens prontas para produção com suporte a Docker Compose e escalabilidade. |

---

## 🛠️ Arquitetura Unificada

O Zapinho WZ reúne em um único repositório:

1. **`src/`**: Motor principal NestJS responsável pelo gateway HTTP/WebSocket, gerenciador de sessões WhatsApp e controle de autenticação.
2. **`dashboard/`**: Interface web moderna desenvolvida em React para acompanhamento das conexões, escaneamento de QR Code e relatórios.
3. **`integrations/ai-chatbot/`**: Módulo integrado de Inteligência Artificial composto por:
   - **Backend Service**: Conector com a API do Google Gemini, suporte a templates conversacionais e armazenamento de estado.
   - **Frontend Flow Editor**: Editor gráfico interativo para construção de árvores de decisão e fluxos de bate-papo.
4. **`sdk/`**: Bibliotecas de integração para PHP e Node.js.

---

## 📥 Instalação e Uso

### Requisitos Prévios
- **Node.js**: `v22.13` ou superior
- **npm**: `v10` ou superior
- **Docker & Docker Compose** (Opcional, mas recomendado para produção)

### 1. Clonar o Repositório
```bash
git clone https://github.com/greedisgood1990-rgb/zapinho-wz.git
cd zapinho-wz
```

### 2. Configurar o Ambiente (`.env`)
Copie o arquivo de exemplo e ajuste as variáveis:
```bash
cp .env.example .env
```

Principais variáveis a serem configuradas no `.env`:
```env
PORT=2785
API_KEY=sua_chave_de_api_segura
GEMINI_API_KEY=sua_chave_api_google_gemini
WWEBJS_WEB_VERSION=off
```

### 3. Instalar Dependências e Iniciar
```bash
# Instalação das dependências da API e do Dashboard
npm install
npm run dashboard:install

# Iniciar em modo de desenvolvimento (API + Dashboard)
npm run dev
```

### 4. Executando via Docker Compose
```bash
docker-compose up -d --build
```
Acesse o painel administrativo em: `http://localhost:2785`

---

## 🤖 Módulo de IA Chatbot

O módulo de IA integrado (`integrations/ai-chatbot`) permite criar bots conversacionais inteligentes baseados no **Google Gemini**.

### Funcionalidades do Chatbot:
- **Modelos de Atendimento Prontos**:
  - 📅 **Agendamento de Consultas / Reuniões** (`appointment.json`)
  - 🛒 **Suporte E-commerce & Pedidos** (`ecommerce.json`)
  - ❓ **FAQ & Suporte Automatizado** (`faq_support.json`)
  - 🎯 **Captura de Leads** (`lead_gen.json`)
- **Geração Dinâmica de Respostas**: O motor processa a intenção do cliente no WhatsApp e executa ações dinâmicas configuradas no Flow Builder.

---

## 📚 Documentação da API

Após iniciar o Zapinho WZ, acesse a documentação interativa Swagger em:
👉 `http://localhost:2785/api/docs`

### Exemplo de Envio de Mensagem (PHP SDK):

```php
require_once 'sdk/php/ZapinhoLegacyClient.php';

$client = new ZapinhoClient('http://localhost:2785', 'sua_chave_api');

// Enviar mensagem de texto (formata automaticamente o número para @c.us)
$resposta = $client->sendText('sessao_principal', '5511999999999', 'Olá! Esta é uma mensagem do Zapinho WZ.');

print_r($resposta);
```

### Exemplo via cURL:

```bash
curl -X POST "http://localhost:2785/api/sessions/principal/messages/send-text" \
  -H "x-api-key: sua_chave_api" \
  -H "Content-Type: application/json" \
  -d '{
    "chatId": "5511999999999@c.us",
    "text": "Teste de mensagem via Zapinho WZ API!"
  }'
```

---

## 🛡️ Diretrizes de Uso Seguro (Boas Práticas)

- **Aquecimento de Números Novos**: Em números recentemente cadastrados, inicie a comunicação gradualmente para evitar bloqueios preventivos pelo WhatsApp.
- **Uso de Proxy**: Para operações com múltiplas contas, utilize a configuração de proxy individual por sessão disponível na API.
- **Controle de Taxa (Rate Limit)**: Mantenha as configurações de limite de requisições ativas para evitar disparos massivos em curtos intervalos.

---

## 📄 Licença e Créditos

O **Zapinho WZ** é distribuído sob a licença [MIT](./LICENSE).

- **Base de Código**: Baseado nos projetos open source [OpenWA](https://github.com/rmyndharis/OpenWA) e `whatsapp-web.js`.
- **Módulo AI Chatbot**: Integrado a partir do projeto `WhatsApp-AI-Chatbot` (por Saini-Yogesh & ZCoders).
- **Desenvolvimento & Customizações**: Equipe Zapinho WZ.
