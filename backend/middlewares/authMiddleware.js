import jwt from "jsonwebtoken";
import Student from "../models/student.js";
import Teacher from "../models/teacher.js";

// Middleware to protect routes that require student authentication
export const protectStudent = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user exists
    const student = await Student.findById(decoded.id);

    if (!student) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.student = student;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
    });
  }
};

// Middleware to protect routes that require teacher authentication
export const protectTeacher = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user exists
    const teacher = await Teacher.findById(decoded.id);

    if (!teacher) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.teacher = teacher;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
    });
  }
};
