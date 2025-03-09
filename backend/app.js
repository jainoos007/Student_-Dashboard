import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/student-route.js";
import cors from "cors";

// Load environment variables
dotenv.config();

const app = express();

//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("API is running...");
});

//mongodb connection
//admin007-admin321
mongoose
  .connect(
    "mongodb+srv://admin007:admin321@cluster0.dph3d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then((e) => console.log("MongoDB connected successfully"))
  .catch((err) => console.log("Error connecting to MongoDB" + err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
