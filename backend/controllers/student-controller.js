import Student from "../models/student.js";

//get all students
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

//signup
export const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, age } = req.body;

    //check for existing students
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: "User already exist" });
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
    // Exclude sensitive fields from the response
    const { password: _, ...studentData } = newStudent.toObject();
    return res
      .status(201)
      .json({ message: "User registered successfully.", student: studentData });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
};

//login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for email and password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email or password",
      });
    }

    //check for existing student
    const existinStudent = await Student.findOne({ email });
    if (existinStudent) {
      // Compare the provided password with the hashed password
      const isPasswordValid = await existinStudent.comparePassword(password);

      if (isPasswordValid) {
        // Exclude sensitive fields from the response
        const { password: _, ...studentData } = existinStudent.toObject();
        return res.status(200).json({
          message: "Login successful.",
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
