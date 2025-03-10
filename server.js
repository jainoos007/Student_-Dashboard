import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for API
app.use(cors());
app.use(express.json());

// Import backend routes
import authRoutes from "./backend/routes/authRoutes.js";
import studentRoutes from "./backend/routes/student-route.js";
import teacherRoutes from "./backend/routes/teacher-route.js";

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);

// --- Serve the Frontend ---
// Get the correct directory path in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static frontend files
app.use(express.static(path.join(__dirname, "frontend", "dist")));

// Serve React frontend for unknown routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
