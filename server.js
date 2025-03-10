// Use dynamic import for app.js
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import express from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Dynamically import the app from backend
const startServer = async () => {
  const { app } = await import("./backend/app.js");

  // Serve static files from the React Vite build
  app.use(express.static(join(__dirname, "frontend/dist")));

  // For any request not caught by backend routes, serve the React app
  app.get("*", (req, res) => {
    res.sendFile(join(__dirname, "frontend/dist", "index.html"));
  });

  // Get port from backend or use 5000
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer().catch(console.error);
