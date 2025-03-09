import jwt from "jsonwebtoken";
import Student from "../models/student";
import Teacher from "../models/teacher";

// Middleware to verify JWT token
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if this is a student or teacher
      if (decoded.role === "student") {
        req.user = await Student.findById(decoded.id).select("-password");
        req.role = "student";
      } else if (decoded.role === "teacher") {
        req.user = await Teacher.findById(decoded.id).select("-password");
        req.role = "teacher";
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
};

// Middleware to verify teacher role
const teacherOnly = (req, res, next) => {
  if (req.role !== "teacher") {
    res.status(403);
    throw new Error("Not authorized, teachers only");
  }
  next();
};

// Middleware to verify student role
const studentOnly = (req, res, next) => {
  if (req.role !== "student") {
    res.status(403);
    throw new Error("Not authorized, students only");
  }
  next();
};

module.exports = { protect, teacherOnly, studentOnly };
