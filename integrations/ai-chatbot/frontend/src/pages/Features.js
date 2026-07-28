import React, { useEffect } from "react";
import { Link } from "../components/Router";
import { 
  Layers, 
  Cpu, 
  MessageSquare, 
  BarChart3, 
  ShieldCheck, 
  ArrowRight,
  Play,
  Zap,
  Code
} from "lucide-react";
import "./Features.css";

export default function Features() {
  useEffect(() => {
    document.title = "Features | Visual Canvas & Gemini AI | WhatsAppFlows";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Explore advanced features of WhatsAppFlows: visual drag-and-drop builder, Gemini AI powered dialogs, real-time message simulator, secure SHA-256 webhooks, and live traffic logging."
      );
    }
  }, []);

  return (
    <div className="features-page">
      {/* GLOW DECORATIONS */}
      <div className="features-glow features-glow-1"></div>
      <div className="features-glow features-glow-2"></div>

      <header className="features-hero">
        <div className="features-container">
          <span className="features-badge">
            <Zap size={12} className="badge-icon" /> Powerful Capabilities
          </span>
          <h1>Orchestrate every WhatsApp chat <span className="highlight">without coding</span></h1>
          <p className="features-subtitle">
            Deploy interactive, state-driven, and AI-optimized conversational experiences designed for maximum user engagement and 99.9% uptime.
          </p>
        </div>
      </header>

      <main className="features-container">
        {/* CORE FEATURES GRID */}
        <section className="features-grid">
          
          <div className="feature-detail-card">
            <div className="card-icon-wrapper">
              <Layers size={24} />
            </div>
            <h3>Visual Flow Workspace</h3>
            <p>
              Build your logic visually using our React-Flow drag and drop interface. Set starting questions, user responses, branch options, and transition rules.
            </p>
            <ul className="card-list">
              <li>Snap-to-grid connection lines</li>
              <li>Multiple custom response sockets</li>
              <li>Save & export JSON configuration</li>
            </ul>
          </div>

          <div className="feature-detail-card">
            <div className="card-icon-wrapper text-green">
              <Cpu size={24} />
            </div>
            <h3>Gemini AI Integration</h3>
            <p>
              Instantly draft answers using Google Gemini AI. Enter your company name and bio, and watch our assistant write optimized flow diagrams for you.
            </p>
            <ul className="card-list">
              <li>Natural Language Intent matching</li>
              <li>Instant response auto-completion</li>
              <li>Dynamic instructions override</li>
            </ul>
          </div>

          <div className="feature-detail-card">
            <div className="card-icon-wrapper">
              <MessageSquare size={24} />
            </div>
            <h3>Real-Time Live Simulator</h3>
            <p>
              Never guess what your users will see. Test your logic paths using the simulator. Type messages, select buttons, and view flow response instantly.
            </p>
            <ul className="card-list">
              <li>Interactive simulated chat bubble</li>
              <li>Instant response latency validation</li>
              <li>Mobile shell preview render</li>
            </ul>
          </div>

          <div className="feature-detail-card">
            <div className="card-icon-wrapper">
              <BarChart3 size={24} />
            </div>
            <h3>Analytics & Error Logs</h3>
            <p>
              Identify bottlenecks easily. Our admin panel provides real-time graphs showing webhook trigger volume, database save events, and service status.
            </p>
            <ul className="card-list">
              <li>Success vs. error tracking charts</li>
              <li>Database save confirmations</li>
              <li>Custom status alerts</li>
            </ul>
          </div>

          <div className="feature-detail-card">
            <div className="card-icon-wrapper">
              <ShieldCheck size={24} />
            </div>
            <h3>Secure Webhook Architecture</h3>
            <p>
              Protect customer communications. All events use SHA-256 cryptographic verification matching Meta Business API v18.0 standards.
            </p>
            <ul className="card-list">
              <li>Direct Meta Webhook compliance</li>
              <li>TLS 1.3 encrypted data channel</li>
              <li>Access token auto-refresh</li>
            </ul>
          </div>

          <div className="feature-detail-card">
            <div className="card-icon-wrapper">
              <Code size={24} />
            </div>
            <h3>Developer Extensions</h3>
            <p>
              Built to be highly extensible. Easily add new views, integrate custom CRM databases, or forward chat tickets to customer support agents.
            </p>
            <ul className="card-list">
              <li>Clean React custom-router architecture</li>
              <li>Raw MongoDB / Mongoose save endpoints</li>
              <li>Open JSON payload configuration</li>
            </ul>
          </div>

        </section>

        {/* INTERACTIVE WORKFLOW SECTION */}
        <section className="tech-showcase">
          <div className="showcase-content">
            <h2>Seamless Integration Lifecycle</h2>
            <p>
              From visual design to live production servers, here's how WhatsAppFlows routes requests cleanly behind the scenes:
            </p>
            
            <div className="showcase-steps">
              <div className="showcase-step">
                <span className="step-num">01</span>
                <div>
                  <h4>Sketch & Save Flow</h4>
                  <p>Design blocks in the visual canvas and hit save. This generates your active Flow JSON schema stored in MongoDB.</p>
                </div>
              </div>
              
              <div className="showcase-step">
                <span className="step-num">02</span>
                <div>
                  <h4>Webhook Trigger</h4>
                  <p>A client sends a WhatsApp message. Meta triggers your secure webhook endpoint hosted on your node server.</p>
                </div>
              </div>

              <div className="showcase-step">
                <span className="step-num">03</span>
                <div>
                  <h4>JSON Resolver Execution</h4>
                  <p>Our server checks your active flow schema, maps the user's current session state, and picks the next node response.</p>
                </div>
              </div>

              <div className="showcase-step">
                <span className="step-num">04</span>
                <div>
                  <h4>Cloud API Reply</h4>
                  <p>Your server returns the matching template message (text, buttons, or menus) via the WhatsApp Cloud API instantly.</p>
                </div>
              </div>
            </div>
          </div>

          {/* VISUAL DIAGRAM COMPONENT */}
          <div className="diagram-container">
            <div className="diagram-title">System Request Flow</div>
            <div className="diagram-flow">
              <div className="diagram-box user-box">
                <MessageSquare size={16} />
                <span>User Message</span>
              </div>
              <div className="diagram-arrow">↓</div>
              <div className="diagram-box meta-box">
                <ShieldCheck size={16} />
                <span>Meta Cloud API</span>
              </div>
              <div className="diagram-arrow">↓</div>
              <div className="diagram-box webhook-box">
                <Code size={16} />
                <span>Node.js Webhook Server</span>
              </div>
              <div className="diagram-split">
                <div className="diagram-box sub-box">
                  <Layers size={14} />
                  <span>Flow JSON Schema</span>
                </div>
                <div className="diagram-box sub-box ai-sub-box">
                  <Cpu size={14} />
                  <span>Gemini NLP Fallback</span>
                </div>
              </div>
              <div className="diagram-arrow">↓</div>
              <div className="diagram-box response-box">
                <Zap size={16} />
                <span>WhatsApp Response Dispatch</span>
              </div>
            </div>
          </div>
        </section>

        {/* CALL TO ACTION */}
        <section className="features-cta">
          <div className="cta-box">
            <h2>Ready to try the visual builder?</h2>
            <p>Load the editor canvas, place your first greeting node, and test the flow with our simulator.</p>
            <div className="cta-actions">
              <Link to="/trial" className="btn-glow-border">
                <span className="btn-glow-inner">
                  <span>Open Trial Workspace</span>
                  <Play size={16} />
                </span>
              </Link>
              <Link to="/contact" className="btn btn-secondary">
                <span>Talk with an Engineer</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
