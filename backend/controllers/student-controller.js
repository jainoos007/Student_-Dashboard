import Student from "../models/student.js";
import multer from "multer";
import path from "path";
import fs from "fs";

//get all student
export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    if (!students) {
      return res.status(404).json({ message: "No students found." });
    }
    return res.status(200).json({ students: students });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
};

// Configure storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `student-${req.user._id}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Check file type
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only images with jpg, jpeg, or png format are allowed"));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB max file size
  fileFilter,
});

// Get student profile
const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user._id);

    if (student) {
      res.json({
        _id: student._id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        age: student.age,
        profilePicture: student.profilePicture,
        subjects: student.subjects,
      });
    } else {
      res.status(404);
      throw new Error("Student not found");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update student profile
const updateStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user._id);

    if (student) {
      student.firstName = req.body.firstName || student.firstName;
      student.lastName = req.body.lastName || student.lastName;
      student.email = req.body.email || student.email;
      student.age = req.body.age || student.age;

      if (req.body.password) {
        student.password = req.body.password;
      }

      const updatedStudent = await student.save();

      res.json({
        _id: updatedStudent._id,
        firstName: updatedStudent.firstName,
        lastName: updatedStudent.lastName,
        email: updatedStudent.email,
        age: updatedStudent.age,
        profilePicture: updatedStudent.profilePicture,
      });
    } else {
      res.status(404);
      throw new Error("Student not found");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload profile picture
const uploadProfilePicture = async (req, res) => {
  const uploadSingle = upload.single("profilePicture");

  uploadSingle(req, res, async function (err) {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image file" });
    }

    try {
      const student = await Student.findById(req.user._id);

      if (student) {
        // Delete old profile picture if exists
        if (student.profilePicture) {
          const oldImagePath = path.join(
            __dirname,
            "..",
            student.profilePicture
          );
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }

        // Update profile picture path
        student.profilePicture = `/uploads/${req.file.filename}`;
        await student.save();

        res.json({
          message: "Profile picture uploaded successfully",
          profilePicture: student.profilePicture,
        });
      } else {
        res.status(404);
        throw new Error("Student not found");
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};

// Update student marks
const updateStudentMarks = async (req, res) => {
  try {
    const student = await Student.findById(req.user._id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const { subjects } = req.body;

    if (!subjects || !Array.isArray(subjects)) {
      return res.status(400).json({ message: "Invalid subjects data" });
    }

    // Validate subject data
    for (let i = 0; i < subjects.length; i++) {
      const subjectData = subjects[i];

      if (!subjectData._id) {
        return res.status(400).json({ message: "Subject ID is required" });
      }

      const mark = Number(subjectData.mark);
      if (isNaN(mark) || mark < 0 || mark > 100) {
        return res
          .status(400)
          .json({ message: "Mark must be a number between 0 and 100" });
      }

      // Find and update the subject
      const subjectIndex = student.subjects.findIndex(
        (s) => s._id.toString() === subjectData._id
      );

      if (subjectIndex === -1) {
        return res
          .status(404)
          .json({ message: `Subject with ID ${subjectData._id} not found` });
      }

      student.subjects[subjectIndex].mark = mark;
    }

    await student.save();

    res.json({
      message: "Marks updated successfully",
      subjects: student.subjects,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  getStudentProfile,
  updateStudentProfile,
  uploadProfilePicture,
  updateStudentMarks,
};
