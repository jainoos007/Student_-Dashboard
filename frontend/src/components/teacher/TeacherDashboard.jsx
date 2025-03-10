import React, { useState, useEffect } from "react";
import {
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} from "../../services/api";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { toast } from "react-toastify";
import {
  FaUserGraduate,
  FaEdit,
  FaTrash,
  FaSearch,
  FaPlus,
} from "react-icons/fa";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const data = await getAllStudents();
      setStudents(data);
    } catch (error) {
      toast.error("Failed to load students data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredStudents = students.filter(
    (student) =>
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = async (studentId) => {
    try {
      const data = await getStudentById(studentId);
      setSelectedStudent(data);
      setShowEditForm(true);
    } catch (error) {
      toast.error("Failed to load student data");
    }
  };

  const handleDelete = async (studentId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await deleteStudent(studentId);
        toast.success("Student deleted successfully");
        fetchStudents();
      } catch (error) {
        toast.error("Failed to delete student");
      }
    }
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    age: Yup.number()
      .min(18, "Age must be at least 18")
      .required("Age is required"),
  });

  const handleUpdateStudent = async (values) => {
    try {
      await updateStudent(selectedStudent._id, values);
      toast.success("Student updated successfully");
      setShowEditForm(false);
      fetchStudents();
    } catch (error) {
      toast.error("Failed to update student");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
        <div className="flex items-center mt-4 md:mt-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Search students..."
              className="form-input pl-10 pr-4 py-2"
              value={searchTerm}
              onChange={handleSearch}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-center mb-4">
          <FaUserGraduate className="text-blue-600 text-xl mr-2" />
          <h2 className="text-xl font-semibold">Manage Students</h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading students...</p>
            </div>
          </div>
        ) : (
          <>
            {filteredStudents.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-3 px-4 border-b text-left">Name</th>
                      <th className="py-3 px-4 border-b text-left">Email</th>
                      <th className="py-3 px-4 border-b text-center">Age</th>
                      <th className="py-3 px-4 border-b text-center">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => (
                      <tr key={student._id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 border-b">
                          {student.firstName} {student.lastName}
                        </td>
                        <td className="py-3 px-4 border-b">{student.email}</td>
                        <td className="py-3 px-4 border-b text-center">
                          {student.age}
                        </td>
                        <td className="py-3 px-4 border-b text-center">
                          <button
                            onClick={() => handleEdit(student._id)}
                            className="text-blue-600 hover:text-blue-800 mr-3"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(student._id)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                {searchTerm
                  ? "No students found matching your search criteria"
                  : "No students available"}
              </div>
            )}
          </>
        )}
      </div>

      {/* Edit Student Modal */}
      {showEditForm && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Student</h2>
            <Formik
              initialValues={{
                firstName: selectedStudent.firstName || "",
                lastName: selectedStudent.lastName || "",
                email: selectedStudent.email || "",
                age: selectedStudent.age || "",
              }}
              validationSchema={validationSchema}
              onSubmit={handleUpdateStudent}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <div>
                    <label htmlFor="firstName" className="form-label">
                      First Name
                    </label>
                    <Field
                      type="text"
                      id="firstName"
                      name="firstName"
                      className="form-input"
                    />
                    <ErrorMessage
                      name="firstName"
                      component="div"
                      className="form-error"
                    />
                  </div>

                  <div>
                    <label htmlFor="lastName" className="form-label">
                      Last Name
                    </label>
                    <Field
                      type="text"
                      id="lastName"
                      name="lastName"
                      className="form-input"
                    />
                    <ErrorMessage
                      name="lastName"
                      component="div"
                      className="form-error"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <Field
                      type="email"
                      id="email"
                      name="email"
                      className="form-input"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="form-error"
                    />
                  </div>

                  <div>
                    <label htmlFor="age" className="form-label">
                      Age
                    </label>
                    <Field
                      type="number"
                      id="age"
                      name="age"
                      className="form-input"
                    />
                    <ErrorMessage
                      name="age"
                      component="div"
                      className="form-error"
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setShowEditForm(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
