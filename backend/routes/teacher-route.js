import express from "express";

import {
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} from "../controllers/teacher-controller.js";

import { protect, teacherOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);
router.use(teacherOnly);

// Student management routes
router.get("/students", getAllStudents);
router
  .route("/students/:id")
  .get(getStudentById)
  .put(updateStudent)
  .delete(deleteStudent);

export default router;
