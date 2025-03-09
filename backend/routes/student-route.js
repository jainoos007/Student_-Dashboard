import express from "express";
import {
  getProfile,
  updateProfile,
  updateSubjectMarks,
  upload,
} from "../controllers/student-controller.js";
import protectStudent from "../middlewares/authMiddleware.js";

const router = express.Router();

// Protect all routes
router.use(protectStudent);

// Student profile routes
router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.put("/profile/picture", upload.single("profilePicture"), updateProfile);
router.put("/marks", updateSubjectMarks);

export default router;
