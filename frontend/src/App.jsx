import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Context Provider
import { AuthProvider } from "./contexts/AuthContext.jsx";

// Auth Components
import StudentLogin from "./components/auth/StudentLogin.jsx";
import StudentRegister from "./components/auth/StudentRegister.jsx";
import TeacherLogin from "./components/auth/TeacherLogin.jsx";
import TeacherRegister from "./components/auth/TeacherRegister.jsx";

// Student Components
import StudentDashboard from "./components/student/StudentDashboard.jsx";

// Teacher Components
import TeacherDashboard from "./components/teacher/TeacherDashboard.jsx";

// Protected Routes
import {
  StudentRoute,
  TeacherRoute,
  PublicRoute,
} from "./utils/ProtectedRoutes.jsx";

// Home Page Component
const HomePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-6">
          Welcome to Student Registration System
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          A comprehensive platform for students and teachers to manage academic
          information.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-6">
            <h2 className="text-xl font-bold mb-4">For Students</h2>
            <p className="text-gray-600 mb-4">
              Register, view your academic progress, update personal
              information, and more.
            </p>
            <div className="flex space-x-4 justify-center">
              <a href="/login" className="btn-primary">
                Login
              </a>
              <a href="/register" className="btn-secondary">
                Register
              </a>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-bold mb-4">For Teachers</h2>
            <p className="text-gray-600 mb-4">
              Manage student records, update academic information, and track
              student progress.
            </p>
            <div className="flex space-x-4 justify-center">
              <a href="/teacher/login" className="btn-primary">
                Login
              </a>
              <a href="/teacher/register" className="btn-secondary">
                Register
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicRoute />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<StudentLogin />} />
            <Route path="/register" element={<StudentRegister />} />
            <Route path="/teacher/login" element={<TeacherLogin />} />
            <Route path="/teacher/register" element={<TeacherRegister />} />
          </Route>

          {/* Student Protected Routes */}
          <Route element={<StudentRoute />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            {/* Add more student routes here */}
          </Route>

          {/* Teacher Protected Routes */}
          <Route element={<TeacherRoute />}>
            <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
            {/* Add more teacher routes here */}
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Toast Notifications Container */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </Router>
    </AuthProvider>
  );
};

export default App;
