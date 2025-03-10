import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/student-route.js";
import teacherRoutes from "./routes/teacher-route.js";
import cors from "cors";
import path from "path";
import fileUpload from "express-fileupload";

// Load environment variables
dotenv.config();

const app = express();

//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable file upload middleware
app.use(fileUpload());

//routes
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("API is running...");
});

//mongodb connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then((e) => console.log("MongoDB connected successfully"))
  .catch((err) => console.log("Error connecting to MongoDB" + err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
