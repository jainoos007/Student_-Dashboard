import express from "express";
import {
  getAllStudents,
  getStudentProfile,
  updateStudentProfile,
  uploadProfilePicture,
  updateStudentMarks,
} from "../controllers/student-controller.js";

const router = express.Router();

//get all students
router.get("/", getAllStudents);

// Student profile routes
router.route("/profile").get(getStudentProfile).put(updateStudentProfile);

//upload profile pic
router.post("/profile/upload", uploadProfilePicture);

// Student marks route
router.put("/marks", updateStudentMarks);

export default router;
