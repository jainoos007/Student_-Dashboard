import Student from "../models/student.js";
import multer from "multer";
import path from "path";
import fs from "fs";

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "./uploads/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `student-${req.student.id}${path.extname(file.originalname)}`);
  },
});

// Filter for image types
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit
});

// Get student profile
export const getProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.student.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

// Update student profile
export const updateProfile = async (req, res) => {
  try {
    // Exclude fields that should not be updated via this route
    const { password, email, ...updateData } = req.body;

    // If there's a file upload, add profilePicture to updateData
    if (req.file) {
      updateData.profilePicture = `/uploads/${req.file.filename}`;
    }

    const student = await Student.findByIdAndUpdate(
      req.student.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

// Update subject marks
export const updateSubjectMarks = async (req, res) => {
  try {
    const { subjects } = req.body;

    if (!subjects || !Array.isArray(subjects)) {
      return res.status(400).json({
        success: false,
        message: "Please provide subject data",
      });
    }

    const student = await Student.findById(req.student.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Update marks for each subject
    subjects.forEach((subjectUpdate) => {
      const subjectToUpdate = student.subjects.find(
        (s) => s.name === subjectUpdate.name
      );
      if (subjectToUpdate) {
        subjectToUpdate.marks = subjectUpdate.marks;
      }
    });

    await student.save();

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};
