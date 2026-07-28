import React, { useEffect, useState } from "react";
import { useRouter } from "../components/Router";
import { 
  FileText, 
  Coffee, 
  LifeBuoy, 
  Calendar,
  Layers,
  ArrowRight,
  Clock,
  Play
} from "lucide-react";
import { toast } from "react-hot-toast";
import "./Templates.css";

export default function Templates() {
  const { navigate } = useRouter();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    document.title = "Pre-built WhatsApp Chatbot Templates | WhatsAppFlows";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Select from our library of responsive WhatsApp chatbot templates: E-commerce shopping bots, lead generation quizzes, FAQs, and medical bookings."
      );
    }

    const fetchTemplatesList = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/templates`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setTemplates(data);
        }
      } catch (err) {
        console.error("Error loading templates list:", err);
        toast.error("Failed to load templates from the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchTemplatesList();
  }, [BASE_URL]);

  const handleUseTemplate = (key, name) => {
    toast.success(`Loading "${name}" template workspace...`);
    setTimeout(() => {
      navigate(`/template/${key}`);
    }, 600);
  };

  const getTemplateIcon = (key) => {
    switch (key) {
      case "lead_gen":
        return <FileText size={24} />;
      case "ecommerce":
        return <Coffee size={24} />;
      case "faq_support":
        return <LifeBuoy size={24} />;
      case "appointment":
        return <Calendar size={24} />;
      default:
        return <Layers size={24} />;
    }
  };

  return (
    <div className="templates-page">
      <div className="templates-glow templates-glow-1"></div>
      <div className="templates-glow templates-glow-2"></div>

      <header className="templates-hero">
        <div className="templates-container">
          <span className="templates-badge">Templates Gallery</span>
          <h1>Accelerate build time with <span className="highlight">Pre-Built Layouts</span></h1>
          <p className="templates-subtitle">
            Skip sketching from scratch. Choose a standard conversational workspace below to instantly populate your canvas with logic nodes and response connections.
          </p>
        </div>
      </header>

      <main className="templates-container">
        {loading ? (
          <div className="templates-loading">
            <div className="spinner"></div>
            <p>Loading pre-built templates from server...</p>
          </div>
        ) : (
          <div className="templates-grid">
            {templates.map((template) => (
              <div className="template-card" key={template.key} id={`template-card-${template.key}`}>
                <div className="template-card-header">
                  <div className="template-icon">{getTemplateIcon(template.key)}</div>
                  <span className="template-category">{template.category}</span>
                </div>

                <div className="template-card-body">
                  <h3>{template.name}</h3>
                  <p>{template.description}</p>
                  
                  <div className="template-meta-metrics">
                    <div className="metric-row">
                      <Layers size={14} />
                      <span>{template.nodesCount} Blocks</span>
                    </div>
                    <div className="metric-row">
                      <Clock size={14} />
                      <span>{template.responsesCount} Actions</span>
                    </div>
                  </div>
                </div>

                <div className="template-card-footer">
                  <button 
                    onClick={() => handleUseTemplate(template.key, template.name)}
                    className="btn btn-template-cta w-full"
                    id={`btn-use-${template.key}`}
                  >
                    <span>Use This Template</span>
                    <Play size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CUSTOM LAYOUT PROMPT */}
        <section className="templates-custom-prompt">
          <div className="custom-prompt-wrapper">
            <h2>Need a completely bespoke workflow?</h2>
            <p>Our visual canvas builder allows you to drag custom questions, add buttons, and link options in any order. Start with a blank canvas or contact our team for assistance.</p>
            <div className="custom-prompt-actions">
              <button onClick={() => navigate("/trial")} className="btn btn-outline-white">
                <span>Start Blank Canvas</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
