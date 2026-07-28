// ngrok http 7000
const express = require("express");
const cors = require("cors");

const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const userRoutes = require("./routes/userRoutes");
const templateRoutes = require("./routes/templateRoutes");

app.get("/", (req, res) => {
  res.json({ hello: "test123" });
});

app.use("/api/users", userRoutes);
app.use("/api/templates", templateRoutes);

// Start server
const PORT = process.env.PORT || 7000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
