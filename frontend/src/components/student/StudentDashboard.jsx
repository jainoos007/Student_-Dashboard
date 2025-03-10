import React, { useState, useEffect } from "react";
import {
  getStudentProfile,
  updateStudentMarks,
  updateStudentProfile,
} from "../../services/api";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { FaUser, FaBook, FaChartLine } from "react-icons/fa";
import ProfilePictureUpload from "../common/ProfilePictureUpload";

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
    subjects: Yup.array().of(
      Yup.object().shape({
        _id: Yup.string().required("Subject ID is required"), // Ensure the ID exists
        mark: Yup.number()
          .typeError("Mark must be a number") // Prevents non-numeric values
          .min(0, "Marks must be at least 0")
          .max(100, "Marks cannot exceed 100")
          .required("Mark is required"),
      })
    ),
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

  const handleProfilePictureUpdate = (profilePictureUrl) => {
    setProfileData({
      ...profileData,
      profilePicture: profilePictureUrl,
    });
  };

  const handleMarksUpdate = async (values, { setSubmitting }) => {
    try {
      await updateStudentMarks({ subjects: values.subjects });
      toast.success("Marks updated successfully!");

      // Update state to reflect changes
      setProfileData((prevData) => ({
        ...prevData,
        subjects: values.subjects,
      }));
    } catch (error) {
      toast.error(error.message || "Failed to update marks.");
    } finally {
      setSubmitting(false);
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
            <ProfilePictureUpload
              currentImage={
                profileData?.profilePicture
                  ? `http://localhost:3000${profileData.profilePicture}`
                  : null
              }
              onUpdateSuccess={handleProfilePictureUpdate}
            />
            <div className="flex flex-col items-center mb-6">
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

                {profileData?.subjects?.length > 0 ? (
                  <Formik
                    initialValues={{ subjects: profileData.subjects }}
                    // validationSchema={validationSchema}
                    onSubmit={handleMarksUpdate}
                  >
                    {({ isSubmitting }) => (
                      <Form>
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
                              </tr>
                            </thead>
                            <tbody>
                              <Field name="subjects">
                                {({ field, form }) =>
                                  field.value.map((subject, index) => (
                                    <tr key={subject._id}>
                                      <td className="py-2 px-4 border-b">
                                        {subject.name}
                                      </td>
                                      <td className="py-2 px-4 border-b text-center">
                                        <Field
                                          type="number"
                                          name={`subjects[${index}].mark`}
                                          className="border p-1 w-20 text-center"
                                        />
                                        <ErrorMessage
                                          name={`subjects[${index}].mark`}
                                          component="div"
                                          className="text-red-500 text-xs"
                                        />
                                      </td>
                                    </tr>
                                  ))
                                }
                              </Field>
                            </tbody>
                          </table>
                        </div>

                        <div className="mt-4">
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
                ) : (
                  <p className="text-gray-500">No academic records available</p>
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
