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
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
};
