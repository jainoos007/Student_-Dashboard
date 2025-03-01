import express from "express";
import {
  getAllStudents,
  login,
  signup,
} from "../controllers/student-controller.js";

const router = express.Router();

router.get("/", getAllStudents); //get all students
router.post("/signup", signup); //signin for student
router.post("/login", login); //login for student

export default router;
