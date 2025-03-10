import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import Layout from "../components/common/Layout.jsx";

// For protecting student routes
export const StudentRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if the user is logged in and is a student (doesn't have the teacher role)
  if (user && user.role !== "teacher") {
    return (
      <Layout>
        <Outlet />
      </Layout>
    );
  }

  // If the user is not logged in or is a teacher, redirect to login
  return <Navigate to="/login" replace />;
};

// For protecting teacher routes
export const TeacherRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if the user is logged in and is a teacher
  if (user && user.role === "teacher") {
    return (
      <Layout>
        <Outlet />
      </Layout>
    );
  }

  // If the user is not logged in or is not a teacher, redirect to teacher login
  return <Navigate to="/teacher/login" replace />;
};

// For public routes (wrapped in layout)
export const PublicRoute = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};
