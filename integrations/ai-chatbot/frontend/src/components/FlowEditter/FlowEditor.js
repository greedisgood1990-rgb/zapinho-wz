import React, { useState, useCallback, useEffect } from "react";
import ReactFlow, {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Background,
  Controls,
  MiniMap,
} from "reactflow";
import "reactflow/dist/style.css";
import CustomNode from "./CustomNode";
import "./FlowEditor.css";
import { toast } from "react-hot-toast";
import { useRouter } from "../Router";

const nodeTypes = { custom: CustomNode };
const BASE_URL = process.env.REACT_APP_BASE_URL;

const FlowEditor = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [loading, setLoading] = useState(false);

  const { path } = useRouter();
  const pathParts = path.split("/");
  const templateKey = path.startsWith("/template/") ? pathParts[2] : null;
  const isTemplate = !!templateKey;

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

  const addNode = () => {
    if (isTemplate) return; // Prevent adding nodes to template preview
    const id = `node_${nodes.length + 1}`;
    const newNode = {
      id,
      type: "custom",
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: {
        id,
        label: "New Question?",
        responses: ["Yes", "No", "Other"],
        onChange: (text) => updateNodeLabel(id, text),
        onResponseChange: (index, text) => updateResponse(id, index, text),
        onDelete: () => deleteNode(id),
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const updateNodeLabel = (id, text) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, label: text } }
          : node,
      ),
    );
  };

  const updateResponse = (id, index, text) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                responses: node.data.responses.map((resp, i) =>
                  i === index ? text : resp,
                ),
              },
            }
          : node,
      ),
    );
  };

  const deleteNode = (id) => {
    if (isTemplate) return;
    setNodes((nds) => nds.filter((node) => node.id !== id));
    setEdges((eds) =>
      eds.filter((edge) => edge.source !== id && edge.target !== id),
    );
  };

  const onConnect = (params) => {
    if (isTemplate) return;
    const { sourceHandle } = params;

    // If connecting to a full box, allow it (target should be a full node)
    if (!sourceHandle) {
      setEdges((eds) => addEdge({ ...params }, eds));
    } else {
      // Otherwise, enforce connections only from responses
      setEdges((eds) =>
        addEdge({ ...params, label: sourceHandle.split("-")[1] }, eds),
      );
    }
  };

  const saveFlow = () => {
    if (isTemplate) return;
    setLoading(true);
    try {
      const flowData = { nodes, edges };
      localStorage.setItem("whatsapp_flow_custom_flow", JSON.stringify(flowData));
      toast.success("Flow saved locally in browser memory!");
    } catch (error) {
      console.error("Error saving custom flow:", error);
      toast.error("Failed to save flow.");
    }
    setLoading(false);
  };

  const loadTemplateIntoState = (schema) => {
    if (!schema || !schema.nodes) return;
    const updatedNodes = schema.nodes.map((node) => {
      if (node.type === "custom") {
        return {
          ...node,
          data: {
            ...node.data,
            onDelete: () => deleteNode(node.id),
            onChange: (text) => updateNodeLabel(node.id, text),
            onResponseChange: (index, text) =>
              updateResponse(node.id, index, text),
          },
        };
      }
      return node;
    });

    setNodes(updatedNodes);
    setEdges(schema.edges || []);
  };

  // Load template from URL subpath (e.g. /template/ecommerce)
  // Or fetch custom flow from localStorage if on blank sandbox path
  useEffect(() => {
    if (isTemplate) {
      const loadTemplate = async () => {
        try {
          const res = await fetch(`${BASE_URL}/api/templates/${templateKey}`);
          if (res.ok) {
            const data = await res.json();
            if (data && data.schema) {
              loadTemplateIntoState(data.schema);
              toast.success(`Successfully loaded "${data.name}" template!`);
            }
          } else {
            toast.error("Template not found.");
          }
        } catch (err) {
          console.error("Error fetching template from subpath:", err);
          toast.error("Failed to fetch template from server.");
        }
      };
      loadTemplate();
    } else {
      // Local custom flow loading (completely database-free)
      const savedFlow = localStorage.getItem("whatsapp_flow_custom_flow");
      if (savedFlow) {
        try {
          const parsed = JSON.parse(savedFlow);
          if (parsed && parsed.nodes) {
            loadTemplateIntoState(parsed);
          }
        } catch (err) {
          console.error("Error parsing custom saved flow:", err);
        }
      } else {
        // Start completely blank canvas (plain /trial)
        setNodes([
          {
            id: "start-node",
            type: "default",
            data: { label: "Start your custom flow" },
            position: { x: 300, y: 200 },
          },
        ]);
        setEdges([]);
      }
    }
  }, [path, isTemplate, templateKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // Listen for local custom flow generation updates from LeftBar
  useEffect(() => {
    const handleLocalFlowUpdate = () => {
      const savedFlow = localStorage.getItem("whatsapp_flow_custom_flow");
      if (savedFlow) {
        try {
          const parsed = JSON.parse(savedFlow);
          if (parsed && parsed.nodes) {
            loadTemplateIntoState(parsed);
          }
        } catch (err) {
          console.error("Error parsing custom flow update:", err);
        }
      }
    };

    window.addEventListener("local_flow_updated", handleLocalFlowUpdate);
    return () => {
      window.removeEventListener("local_flow_updated", handleLocalFlowUpdate);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flow-container">
      <div className="flow-continer-navbar">
        {!isTemplate && (
          <button onClick={addNode} className="btn">
            Add Question
          </button>
        )}
        <button
          onClick={saveFlow}
          className="btn"
          disabled={loading || isTemplate}
          style={isTemplate ? { opacity: 0.5, cursor: "not-allowed", background: "#475569" } : {}}
          title={isTemplate ? "Preset templates cannot be overwritten" : "Save custom flow"}
        >
          {isTemplate ? "Template Locked" : (loading ? "Saving..." : "Save")}
        </button>
      </div>
      <div className="flow-editor">
        <ReactFlow
          nodes={
            nodes.length === 0
              ? [
                  {
                    id: "start-node",
                    type: "default",
                    data: { label: "Start your custom flow" },
                    position: { x: 300, y: 200 },
                    draggable: false,
                  },
                ]
              : nodes
          }
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          defaultViewport={{ x: 300, y: 50, zoom: 0.6 }}
        >
          <Background />
          <Controls
            style={{
              background: "rgba(0, 0, 0, 0.7)",
              padding: "8px 12px",
              borderRadius: "10px",
              display: "flex",
              gap: "10px",
            }}
          />
          <MiniMap
            nodeStrokeColor={(node) =>
              node.type === "custom" ? "#ffa726" : "#ffffff"
            }
            nodeColor={(node) =>
              node.type === "custom" ? "#ffa726" : "#ffffff"
            }
            nodeBorderRadius={2}
            position="bottom-right"
          />
        </ReactFlow>
      </div>
    </div>
  );
};

export default FlowEditor;
