// Import backend app.js
const { app } = require("./backend/app");
const path = require("path");
const express = require("express");

// Serve static files from the React Vite build
app.use(express.static(path.join(__dirname, "frontend/dist")));

// For any request not caught by backend routes, serve the React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/dist", "index.html"));
});

// Get port from backend or use 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
