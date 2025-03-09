import express from "express";

import {
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} from "../controllers/teacher-controller.js";

const router = express.Router();

// Student management routes
router.get("/students", getAllStudents);
router
  .route("/students/:id")
  .get(getStudentById)
  .put(updateStudent)
  .delete(deleteStudent);

export default router;
