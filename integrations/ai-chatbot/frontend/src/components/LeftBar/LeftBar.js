import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "../Router";
import "../LeftBar/LeftBar.css";

const BASE_URL = process.env.REACT_APP_BASE_URL;
const LeftBar = ({ flow_id, business_id }) => {
  const { path } = useRouter();
  const templateKey = path.startsWith("/template/") ? path.split("/")[2] : null;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [aiResponses, setAiResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTemplateDetails = async (key) => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/api/templates/${key}`);
      if (!response.ok) throw new Error("Failed to fetch template details");

      const data = await response.json();
      setName(data.name || "");
      setDescription(data.description || "");

      const mappedResponses = (data.schema?.nodes || [])
        .filter((node) => node.type === "custom")
        .map((node) => ({
          bot: node.data.label,
          options: node.data.responses,
        }));
      setAiResponses(mappedResponses);
      setLoading(false);
    } catch (err) {
      console.error("Error loading template details:", err);
      toast.error("Error loading template details.");
      setLoading(false);
    }
  };

  useEffect(() => {
    const pendingToastSuccess = localStorage.getItem("toast_success_message");
    if (pendingToastSuccess) {
      toast.success(pendingToastSuccess);
      localStorage.removeItem("toast_success_message");
    }
    const pendingToastError = localStorage.getItem("toast_error_message");
    if (pendingToastError) {
      toast.error(pendingToastError);
      localStorage.removeItem("toast_error_message");
    }

    if (templateKey) {
      fetchTemplateDetails(templateKey);
    } else {
      // Local custom details preloader
      const savedDetails = localStorage.getItem("whatsapp_flow_custom_details");
      if (savedDetails) {
        try {
          const parsed = JSON.parse(savedDetails);
          setName(parsed.name || "");
          setDescription(parsed.description || "");
          setAiResponses(parsed.aiResponses || []);
        } catch (err) {
          console.error("Error parsing custom saved details:", err);
        }
      } else {
        setName("");
        setDescription("");
        setAiResponses([]);
      }
    }
  }, [templateKey]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (templateKey) return; // Prevent template submission
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: business_id,
          businessName: name,
          businessDescription: description,
          flow_id: flow_id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch AI chatbot recommendations");
      }

      const responseData = await response.json();
      const generatedResponses = responseData.user?.aiResponses || [];
      
      // Update state dynamically (Reactive Update!)
      setAiResponses(generatedResponses);
      
      // Save locally to persist refreshes
      localStorage.setItem(
        "whatsapp_flow_custom_details",
        JSON.stringify({
          name,
          description,
          aiResponses: generatedResponses,
        })
      );

      // Save flow locally and dispatch custom update event to trigger canvas reload
      if (responseData.flow && responseData.flow.nodes) {
        localStorage.setItem(
          "whatsapp_flow_custom_flow",
          JSON.stringify(responseData.flow)
        );
        window.dispatchEvent(new Event("local_flow_updated"));
      }
      
      toast.success("AI chatbot flow and recommendations generated successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to fetch recommendations. Please try again.");
      setError(err.message || "Failed to fetch recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="left-bar">
      <h2>Provide ChatBot Details</h2>
      <form onSubmit={handleSubmit} className="business-form">
        <input
          type="text"
          placeholder="ChatBot Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          readOnly={!!templateKey}
        />
        <textarea
          placeholder="ChatBot Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          readOnly={!!templateKey}
        ></textarea>
        <button 
          type="submit" 
          disabled={loading || !!templateKey}
          style={templateKey ? { opacity: 0.5, cursor: "not-allowed", background: "#475569" } : {}}
        >
          {templateKey ? "Template Locked" : (loading ? "Submitting..." : "Submit")}
        </button>
      </form>

      {loading && <div className="loading-spinner"></div>}
      {error && <p className="error">{error}</p>}

      {aiResponses.length > 0 && (
        <div className="ai-responses">
          <h3>Recommended AI Flow</h3>
          <ul>
            {aiResponses?.map?.((response, index) => (
              <li key={index}>
                {response.question ? (
                  <>
                    <strong>Q:</strong> {response.question}
                    <br />
                    <strong>A:</strong> {response.answer}
                  </>
                ) : (
                  <>
                    <strong>Bot:</strong> {response.bot}
                    <br />
                    <strong>Options:</strong> {response.options?.join(" | ")}
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* eslint-disable-next-line */}
      <h1></h1>
    </div>
  );
};

export default LeftBar;
