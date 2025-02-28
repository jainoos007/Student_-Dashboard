import Student from "../models/student.js";

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
