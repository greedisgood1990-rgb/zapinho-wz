import React, { useEffect } from "react";
import { Link } from "../components/Router";
import { 
  Users, 
  Lightbulb, 
  Settings, 
  Code,
  ArrowRight,
  Database,
  Cpu,
  Smartphone,
  Globe
} from "lucide-react";
import "./About.css";

export default function About() {
  useEffect(() => {
    document.title = "About Us | Conversational AI Workflow Creator | WhatsAppFlows";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Learn about the WhatsAppFlows developer team (Yogesh, Sahil, Ronak), our vision for visual conversational design, and the technical architecture running on Node.js and Gemini AI."
      );
    }
  }, []);

  return (
    <div className="about-page">
      <div className="about-glow about-glow-1"></div>
      <div className="about-glow about-glow-2"></div>

      <header className="about-hero">
        <div className="about-container">
          <span className="about-badge">Our Story</span>
          <h1>Empowering businesses with <span className="highlight">Visual Chat Journeys</span></h1>
          <p className="about-subtitle">
            We build tools that bridge the gap between static business databases and conversational interfaces on WhatsApp.
          </p>
        </div>
      </header>

      <main className="about-container">
        {/* VISION & VALUE PROPOSITION */}
        <section className="about-vision-grid">
          <div className="vision-card">
            <div className="vision-icon">
              <Lightbulb size={22} />
            </div>
            <h3>Our Mission</h3>
            <p>
              Chatbots should be as easy to design as draw-charts. Our purpose is to replace raw webhook scripts and heavy database setups with a drag-and-drop React canvas that automatically resolves conversational pathways and replies immediately to user questions.
            </p>
          </div>

          <div className="vision-card">
            <div className="vision-icon">
              <Settings size={22} />
            </div>
            <h3>How It Works</h3>
            <p>
              When clients message your number, Meta directs the payload to our Node webhook. The webhook pulls your visual layout, evaluates which question is active, checks input selections, and dispatches responses instantly. When answers are missing, Gemini AI steps in to keep chats moving.
            </p>
          </div>
        </section>

        {/* SYSTEM ARCHITECTURE TIMELINE */}
        <section className="about-architecture">
          <h2>Technical Architecture</h2>
          <p className="section-desc">Designed with high scalability in mind, using structured JSON graphs for flow execution.</p>

          <div className="arch-flow-diagram">
            <div className="arch-node">
              <Smartphone size={24} className="arch-icon text-indigo" />
              <h4>1. Customer Mobile</h4>
              <p>Triggers message over Meta's servers</p>
            </div>
            <div className="arch-connector">──▶</div>
            <div className="arch-node">
              <Globe size={24} className="arch-icon text-green" />
              <h4>2. WhatsApp Cloud API</h4>
              <p>Receives hook & forwards JSON payload</p>
            </div>
            <div className="arch-connector">──▶</div>
            <div className="arch-node">
              <Code size={24} className="arch-icon text-amber" />
              <h4>3. Express Server</h4>
              <p>Validates SHA-256 webhook signatures</p>
            </div>
            <div className="arch-connector">──▶</div>
            <div className="arch-node">
              <Database size={24} className="arch-icon text-sky" />
              <h4>4. MongoDB & Redis</h4>
              <p>Loads active flow & tracks user sessions</p>
            </div>
          </div>
        </section>

        {/* TEAM MEMBERS */}
        <section className="about-team">
          <h2>Meet the Developers</h2>
          <p className="section-desc">The engineering group behind the visual workflow canvas and automation server.</p>

          <div className="team-grid">
            <div className="team-card" id="team-card-yogesh">
              <div className="team-avatar-wrapper">
                <Users size={32} />
              </div>
              <h3>Yogesh</h3>
              <span className="team-role">Lead Fullstack Architect</span>
              <p>Oversees system database structures, React Flow editor state bindings, and Node.js backend signature verification security.</p>
            </div>

            <div className="team-card" id="team-card-sahil">
              <div className="team-avatar-wrapper">
                <Users size={32} />
              </div>
              <h3>Sahil</h3>
              <span className="team-role">Frontend Engineer & Designer</span>
              <p>Directs the styling, CSS layout responsive triggers, interactive UI transitions, and canvas interface visual features.</p>
            </div>

            <div className="team-card" id="team-card-ronak">
              <div className="team-avatar-wrapper">
                <Users size={32} />
              </div>
              <h3>Ronak</h3>
              <span className="team-role">AI Engineer & Webhooks Specialist</span>
              <p>Drives the Gemini AI suggestion prompt configurations, natural language search parsing, and Cloud API response speed optimization.</p>
            </div>
          </div>
        </section>

        {/* TECH STACK GRID */}
        <section className="about-tech-stack">
          <h2>Our Tech Stack</h2>
          <p className="section-desc">Modern technologies powering visual flow drafting and live chatbot serving.</p>

          <div className="tech-logos-grid">
            <div className="tech-badge">
              <Code size={16} />
              <span>React 18</span>
            </div>
            <div className="tech-badge">
              <Code size={16} />
              <span>React Flow</span>
            </div>
            <div className="tech-badge">
              <Code size={16} />
              <span>Node.js / Express</span>
            </div>
            <div className="tech-badge">
              <Database size={16} />
              <span>MongoDB / Mongoose</span>
            </div>
            <div className="tech-badge">
              <Database size={16} />
              <span>Redis Cache</span>
            </div>
            <div className="tech-badge">
              <Cpu size={16} />
              <span>Gemini AI SDK</span>
            </div>
            <div className="tech-badge">
              <Smartphone size={16} />
              <span>WhatsApp Cloud API</span>
            </div>
          </div>
        </section>

        {/* ACTION CTA */}
        <section className="about-cta">
          <div className="about-cta-box">
            <h2>Ready to see it in action?</h2>
            <p>Prototype your first conversation flow and test how nodes link together in our simulator sandbox.</p>
            <div className="about-cta-buttons">
              <Link to="/trial" className="btn-glow-border">
                <span className="btn-glow-inner">
                  <span>Start Building Free</span>
                  <ArrowRight size={16} />
                </span>
              </Link>
              <Link to="/docs" className="btn btn-secondary">
                <span>Read Developer Guide</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
