import express from "express";
import {
  getStudentProfile,
  updateStudentMarks,
  updateStudentProfile,
  uploadProfilePicture,
} from "../controllers/student-controller.js";
import { protect, studentOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);
router.use(studentOnly);

// Student profile routes
router.route("/profile").get(getStudentProfile).put(updateStudentProfile);

router.post("/profile/upload", uploadProfilePicture);

// Student marks route
router.put("/marks", updateStudentMarks);

export default router;
