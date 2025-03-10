import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { registerTeacher } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";

const TeacherRegister = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  const handleSubmit = async (values) => {
    setIsSubmitting(true);

    // Remove confirmPassword field as it's not needed in API
    const { confirmPassword, ...userData } = values;

    try {
      // Using async/await pattern for registration
      const data = await registerTeacher(userData);
      login(data, data.token);
      toast.success("Registration successful!");
      navigate("/teacher/dashboard");
    } catch (error) {
      toast.error(error.message || "Failed to register");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 card p-6">
      <h2 className="text-2xl font-bold text-center mb-6">
        Teacher Registration
      </h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form className="space-y-4">
            <div>
              <label htmlFor="firstName" className="form-label">
                First Name
              </label>
              <Field
                type="text"
                id="firstName"
                name="firstName"
                className={`form-input ${
                  errors.firstName && touched.firstName ? "border-red-500" : ""
                }`}
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
                className={`form-input ${
                  errors.lastName && touched.lastName ? "border-red-500" : ""
                }`}
              />
              <ErrorMessage
                name="lastName"
                component="div"
                className="form-error"
              />
            </div>

            <div>
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <Field
                type="email"
                id="email"
                name="email"
                className={`form-input ${
                  errors.email && touched.email ? "border-red-500" : ""
                }`}
              />
              <ErrorMessage
                name="email"
                component="div"
                className="form-error"
              />
            </div>

            <div>
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <Field
                type="password"
                id="password"
                name="password"
                className={`form-input ${
                  errors.password && touched.password ? "border-red-500" : ""
                }`}
              />
              <ErrorMessage
                name="password"
                component="div"
                className="form-error"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <Field
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className={`form-input ${
                  errors.confirmPassword && touched.confirmPassword
                    ? "border-red-500"
                    : ""
                }`}
              />
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="form-error"
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registering..." : "Register"}
            </button>
          </Form>
        )}
      </Formik>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/teacher/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Are you a student?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register as Student
          </Link>
        </p>
      </div>
    </div>
  );
};

export default TeacherRegister;
