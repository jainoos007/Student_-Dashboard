import jwt from "jsonwebtoken";
import Student from "../models/student.js";
import sendEmail from "../utils/emailService.js";

// Generate token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Register student
export const registerStudent = async (req, res) => {
  try {
    const { firstName, lastName, email, password, age } = req.body;

    //check for existing students
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: "Email already registered" });
    }

    //create new student
    const newStudent = new Student({
      firstName,
      lastName,
      email,
      password,
      age,
    });

    //save student to database
    try {
      await newStudent.save();
    } catch (err) {
      console.error("Error saving user to database", err);
      return res
        .status(500)
        .json({ message: "Server error while saving student." });
    }

    // Send confirmation email
    await sendEmail({
      email: newStudent.email,
      subject: "Registration Successful",
      message: `Hello ${newStudent.firstName},\n\nYour registration was successful. Welcome to our student portal!\n\nRegards,\nStudent Registration System`,
    });

    // Generate token
    const token = generateToken(newStudent._id, "student");

    // Exclude sensitive fields from the response
    const { password: _, ...studentData } = newStudent.toObject();
    return res.status(201).json({
      message: "Student registered successfully.",
      token,
      student: studentData,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
};

//login student
export const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for email and password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    //check for existing student
    const existinStudent = await Student.findOne({ email });
    if (existinStudent) {
      // Compare the provided password with the hashed password
      const isPasswordValid = await existinStudent.comparePassword(password);

      if (isPasswordValid) {
        // Generate token
        const token = generateToken(existinStudent._id, "student");

        // Exclude sensitive fields from the response
        const { password: _, ...studentData } = existinStudent.toObject();
        return res.status(200).json({
          message: "Login successful.",
          token,
          student: studentData,
        });
      } else {
        return res.status(401).json({ message: "Incorrect password." });
      }
    } else {
      return res.status(404).json({ message: "User not found." });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
};
