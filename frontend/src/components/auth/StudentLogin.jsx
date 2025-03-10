import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { loginStudent } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";

const StudentLogin = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = (values) => {
    setIsSubmitting(true);

    // Using promise pattern for login
    loginStudent(values)
      .then((data) => {
        login(data, data.token);
        toast.success("Login successful!");
        navigate("/student/dashboard");
      })
      .catch((error) => {
        toast.error(error.message || "Invalid email or password");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="max-w-md mx-auto mt-10 card p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Student Login</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form className="space-y-4">
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

            <button
              type="submit"
              className="btn-primary w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </Form>
        )}
      </Formik>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Are you a teacher?{" "}
          <Link to="/teacher/login" className="text-blue-600 hover:underline">
            Login as Teacher
          </Link>
        </p>
      </div>
    </div>
  );
};

export default StudentLogin;
