import express from "express";
import {
  getStudentProfile,
  updateStudentProfile,
  uploadProfilePicture,
  updateStudentMarks,
} from "../controllers/student-controller.js";
import protectStudent from "../middlewares/authMiddleware.js";

const router = express.Router();

// Student profile routes
router.route("/profile").get(getStudentProfile).put(updateStudentProfile);

//upload profile pic
router.post("/profile/upload", uploadProfilePicture);

// Student marks route
router.put("/marks", updateStudentMarks);

export default router;
