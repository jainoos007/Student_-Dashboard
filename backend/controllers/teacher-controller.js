import Student from "../models/student.js";

// Get all students
export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({}).select("-password");
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get student by ID
export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select("-password");

    if (student) {
      res.json(student);
    } else {
      res.status(404);
      throw new Error("Student not found");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update student
export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (student) {
      student.firstName = req.body.firstName || student.firstName;
      student.lastName = req.body.lastName || student.lastName;
      student.email = req.body.email || student.email;
      student.age = req.body.age || student.age;

      // Update subjects if provided
      if (req.body.subjects && Array.isArray(req.body.subjects)) {
        req.body.subjects.forEach((subjectData) => {
          const subjectIndex = student.subjects.findIndex(
            (s) => s._id.toString() === subjectData._id
          );

          if (subjectIndex !== -1) {
            student.subjects[subjectIndex].mark = subjectData.mark;
          }
        });
      }

      const updatedStudent = await student.save();

      res.json({
        _id: updatedStudent._id,
        firstName: updatedStudent.firstName,
        lastName: updatedStudent.lastName,
        email: updatedStudent.email,
        age: updatedStudent.age,
        subjects: updatedStudent.subjects,
        message: "Student updated successfully",
      });
    } else {
      res.status(404);
      throw new Error("Student not found");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete student
export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (student) {
      await student.deleteOne();
      res.json({ message: "Student removed" });
    } else {
      res.status(404);
      throw new Error("Student not found");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
