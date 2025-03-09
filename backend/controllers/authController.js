import jwt from "jsonwebtoken";
import Student from "../models/student.js";
import Teacher from "../models/teacher.js";
import sendEmail from "../utils/emailService.js";

// Generate token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Register a new student
export const registerStudent = async (req, res) => {
  try {
    const { firstName, lastName, email, password, age } = req.body;

    //check for existing students
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Validate age
    if (age < 18) {
      return res.status(400).json({ message: "Age must be at least 18" });
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
    try {
      await sendEmail({
        email: newStudent.email,
        subject: "Welcome to Student Registration System",
        html: getWelcomeEmailTemplate(newStudent.firstName),
      });
    } catch (emailError) {
      console.error("Error sending welcome email:", emailError);
      // Continue with registration even if email fails
    }

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

// Register a new teacher
export const registerTeacher = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if teacher exists
    const teacherExists = await Teacher.findOne({ email });

    if (teacherExists) {
      return res.status(400).json({ message: "Teacher already exists" });
    }

    // Create teacher
    const teacher = await Teacher.create({
      firstName,
      lastName,
      email,
      password,
    });

    if (teacher) {
      res.status(201).json({
        _id: teacher._id,
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        email: teacher.email,
        token: generateToken(teacher._id, "teacher"),
      });
    } else {
      res.status(400).json({ message: "Invalid teacher data" });
    }
  } catch (error) {
    console.error("Register Teacher Error:", error);
    res.status(500).json({ message: error.message });
  }
};

//Login teacher
export const loginTeacher = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for teacher email
    const teacher = await Teacher.findOne({ email });

    if (teacher && (await teacher.matchPassword(password))) {
      res.json({
        _id: teacher._id,
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        email: teacher.email,
        token: generateToken(teacher._id, "teacher"),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login Teacher Error:", error);
    res.status(500).json({ message: error.message });
  }
};
