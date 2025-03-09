import express from "express";
import {
  registerStudent,
  loginStudent,
} from "../controllers/authController.js";

const router = express.Router();

// Student auth routes
router.post("/student/register", registerStudent);
router.post("/student/login", loginStudent);

export default router;
