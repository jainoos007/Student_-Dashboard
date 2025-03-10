import React, { useState, useEffect } from "react";
import { getStudentProfile, updateStudentProfile } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { FaUser, FaBook, FaChartLine } from "react-icons/fa";

const StudentDashboard = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const data = await getStudentProfile();
        setProfileData(data);
      } catch (error) {
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

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

  const handleProfileUpdate = async (values) => {
    try {
      const updatedProfile = await updateStudentProfile(values);
      updateUser(updatedProfile);
      setProfileData(updatedProfile);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
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
      <h1 className="text-2xl font-bold mb-6">Student Dashboard</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-1/4">
          <div className="card p-4">
            <div className="flex flex-col items-center mb-6">
              <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                <FaUser className="text-blue-600 text-4xl" />
              </div>
              <h2 className="text-xl font-semibold">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-gray-600">{user?.email}</p>
              <p className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded mt-2">
                Student
              </p>
            </div>

            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full text-left px-4 py-2 rounded flex items-center ${
                    activeTab === "profile"
                      ? "bg-blue-100 text-blue-700"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <FaUser className="mr-2" /> Profile
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("academics")}
                  className={`w-full text-left px-4 py-2 rounded flex items-center ${
                    activeTab === "academics"
                      ? "bg-blue-100 text-blue-700"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <FaBook className="mr-2" /> Academics
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("progress")}
                  className={`w-full text-left px-4 py-2 rounded flex items-center ${
                    activeTab === "progress"
                      ? "bg-blue-100 text-blue-700"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <FaChartLine className="mr-2" /> Progress
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-3/4">
          <div className="card p-6">
            {activeTab === "profile" && (
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Profile Information
                </h2>
                {profileData && (
                  <Formik
                    initialValues={{
                      firstName: profileData.firstName || "",
                      lastName: profileData.lastName || "",
                      email: profileData.email || "",
                      age: profileData.age || "",
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleProfileUpdate}
                  >
                    {({ isSubmitting }) => (
                      <Form className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        </div>

                        <div>
                          <label htmlFor="email" className="form-label">
                            Email Address
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

                        <div>
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
                )}
              </div>
            )}

            {activeTab === "academics" && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Academic Records</h2>

                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="py-2 px-4 border-b text-left">
                          Subject
                        </th>
                        <th className="py-2 px-4 border-b text-center">
                          Marks
                        </th>
                        <th className="py-2 px-4 border-b text-center">
                          Grade
                        </th>
                        <th className="py-2 px-4 border-b text-center">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {profileData?.academics?.length > 0 ? (
                        profileData.academics.map((subject, index) => (
                          <tr key={index}>
                            <td className="py-2 px-4 border-b">
                              {subject.name}
                            </td>
                            <td className="py-2 px-4 border-b text-center">
                              {subject.marks}
                            </td>
                            <td className="py-2 px-4 border-b text-center">
                              {subject.grade}
                            </td>
                            <td className="py-2 px-4 border-b text-center">
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
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="4"
                            className="py-4 text-center text-gray-500"
                          >
                            No academic records available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "progress" && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Progress Reports</h2>

                {profileData?.progress?.length > 0 ? (
                  <div className="space-y-4">
                    {profileData.progress.map((report, index) => (
                      <div key={index} className="border rounded-md p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium">{report.term}</h3>
                          <span className="text-sm text-gray-500">
                            {report.date}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-2">{report.comment}</p>
                        <div className="mt-3">
                          <span className="text-sm font-medium">
                            Overall Grade:{" "}
                          </span>
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              report.grade === "A"
                                ? "bg-green-100 text-green-800"
                                : report.grade === "B"
                                ? "bg-blue-100 text-blue-800"
                                : report.grade === "C"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {report.grade}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-4 text-center text-gray-500">
                    No progress reports available
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
