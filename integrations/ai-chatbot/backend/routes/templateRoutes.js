const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const cache = require("../middleware/cache");

const TEMPLATE_DIR = path.join(__dirname, "../templates");

// Helper to read template files
const getTemplateKeys = () => {
    return ["lead_gen", "ecommerce", "faq_support", "appointment", "portfolio"];
};

// Route: Get List of all Templates (metadata only)
router.get("/", cache(86400), (req, res) => {
    try {
        // Cache-Control header for client/browser/CDN caching (1 day)
        res.setHeader("Cache-Control", "public, max-age=86400");

        const keys = getTemplateKeys();
        const templates = keys.map(key => {
            const filePath = path.join(TEMPLATE_DIR, `${key}.json`);
            if (fs.existsSync(filePath)) {
                const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
                // Return only metadata, omit schema to optimize bandwidth
                const { schema, ...metadata } = data;
                return metadata;
            }
            return null;
        }).filter(Boolean);

        res.status(200).json(templates);
    } catch (err) {
        console.error("Error reading templates:", err);
        res.status(500).json({ error: "Failed to load templates list." });
    }
});

// Route: Get Specific Template Schema (full nodes & edges)
router.get("/:key", cache(86400), (req, res) => {
    try {
        const { key } = req.params;

        // Cache-Control header for client/browser/CDN caching (1 day)
        res.setHeader("Cache-Control", "public, max-age=86400");

        const filePath = path.join(TEMPLATE_DIR, `${key}.json`);
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: "Template not found" });
        }

        const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
        res.status(200).json(data);
    } catch (err) {
        console.error(`Error loading template ${req.params.key}:`, err);
        res.status(500).json({ error: "Failed to load template details." });
    }
});

module.exports = router;
