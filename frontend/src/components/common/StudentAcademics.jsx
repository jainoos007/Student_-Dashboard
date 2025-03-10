import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getStudentById,
  getStudentAcademics,
  updateStudentMarks,
  addSubjectToStudent,
  removeSubjectFromStudent,
} from "../../services/api";
import { toast } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaArrowLeft, FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const StudentAcademics = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [academics, setAcademics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const studentData = await getStudentById(studentId);
        const academicsData = await getStudentAcademics(studentId);

        setStudent(studentData);
        setAcademics(academicsData);
      } catch (error) {
        toast.error("Failed to load student data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [studentId]);

  const addSubjectValidationSchema = Yup.object({
    name: Yup.string().required("Subject name is required"),
    marks: Yup.number()
      .min(0, "Marks cannot be negative")
      .max(100, "Marks cannot exceed 100")
      .required("Marks are required"),
  });

  const calculateGrade = (marks) => {
    if (marks >= 90) return "A+";
    if (marks >= 80) return "A";
    if (marks >= 70) return "B";
    if (marks >= 60) return "C";
    if (marks >= 50) return "D";
    return "F";
  };

  const determineStatus = (marks) => {
    return marks >= 50 ? "Passed" : "Failed";
  };

  const handleAddSubject = async (values, { resetForm }) => {
    try {
      // Calculate grade and status
      const grade = calculateGrade(values.marks);
      const status = determineStatus(values.marks);

      // Add subject to student's academics
      const newSubject = await addSubjectToStudent(studentId, {
        ...values,
        grade,
        status,
      });

      // Update academics state
      setAcademics([...academics, newSubject]);

      toast.success(`Added ${values.name} successfully`);
      resetForm();
      setShowAddForm(false);
    } catch (error) {
      toast.error(error.message || "Failed to add subject");
    }
  };

  const handleEditSubject = (subject) => {
    setSelectedSubject(subject);
    setShowEditForm(true);
  };

  const handleUpdateMarks = async (values) => {
    try {
      // Calculate new grade and status
      const grade = calculateGrade(values.marks);
      const status = determineStatus(values.marks);

      // Update subject marks
      await updateStudentMarks(studentId, {
        subjectId: selectedSubject._id,
        marks: values.marks,
        grade,
        status,
      });

      // Update academics state
      const updatedAcademics = academics.map((subject) =>
        subject._id === selectedSubject._id
          ? { ...subject, marks: values.marks, grade, status }
          : subject
      );

      setAcademics(updatedAcademics);
      toast.success(`Updated marks for ${selectedSubject.name}`);
      setShowEditForm(false);
    } catch (error) {
      toast.error(error.message || "Failed to update marks");
    }
  };

  const handleDeleteSubject = async (subjectId, subjectName) => {
    if (window.confirm(`Are you sure you want to delete ${subjectName}?`)) {
      try {
        await removeSubjectFromStudent(studentId, subjectId);

        // Update academics state
        const updatedAcademics = academics.filter(
          (subject) => subject._id !== subjectId
        );
        setAcademics(updatedAcademics);

        toast.success(`Removed ${subjectName} successfully`);
      } catch (error) {
        toast.error(error.message || "Failed to remove subject");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate("/teacher/dashboard")}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <FaArrowLeft className="mr-2" /> Back to Dashboard
      </button>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Academics: {student?.firstName} {student?.lastName}
        </h1>
        <button
          className="btn-primary flex items-center"
          onClick={() => setShowAddForm(true)}
        >
          <FaPlus className="mr-2" /> Add Subject
        </button>
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">Academic Records</h2>

        {academics.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-4 border-b text-left">Subject</th>
                  <th className="py-3 px-4 border-b text-center">Marks</th>
                  <th className="py-3 px-4 border-b text-center">Grade</th>
                  <th className="py-3 px-4 border-b text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {academics.map((subject) => (
                  <tr key={subject._id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b">{subject.name}</td>
                    <td className="py-3 px-4 border-b text-center">
                      {subject.marks}
                    </td>
                    <td className="py-3 px-4 border-b text-center">
                      {subject.grade}
                    </td>
                    <td className="py-3 px-4 border-b text-center">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          subject.status === "Passed"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {subject.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No academic records available for this student.
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAcademics;
