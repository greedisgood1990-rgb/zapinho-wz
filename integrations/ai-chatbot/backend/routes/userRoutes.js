const express = require("express");
const { generateAIResponses } = require("../services/geminiService");
const getFormattedNodes = require("../services/FlowGenerator");

const router = express.Router();

// Register a business (Dynamic AI Generation Router)
router.post("/register", async (req, res) => {
  try {
    const { businessName, businessDescription } = req.body;

    if (!businessName || !businessDescription) {
      return res.status(400).json({ success: false, message: "Business name and description are required" });
    }

    // 1. Generate AI responses (Q&A recommendations list)
    let aiResponses = [];
    try {
      aiResponses = await generateAIResponses(businessName, businessDescription);
    } catch (aiError) {
      console.error("AI generation error:", aiError.message);
    }

    // 2. Generate React Flow nodes and edges structure
    let flow = { nodes: [], edges: [] };
    try {
      const flowResult = await getFormattedNodes(businessName, businessDescription);
      if (flowResult && flowResult.nodes) {
        flow = flowResult;
      }
    } catch (flowError) {
      console.error("AI flow generation error:", flowError.message);
    }

    return res.status(200).json({
      success: true,
      message: "AI chatbot flow generated successfully",
      user: {
        businessName,
        businessDescription,
        aiResponses,
      },
      flow,
    });

  } catch (error) {
    console.error("Registration error:", error.message);
    return res.status(500).json({ success: false, message: "Registration failed", error: error.message });
  }
});

module.exports = router;
