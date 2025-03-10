import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-blue-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold">
                  Student Registration System
                </span>
              </Link>
            </div>
            <div className="flex items-center">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span>
                    Welcome, {user.firstName} {user.lastName}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-1 rounded"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-x-4">
                  <Link to="/login" className="hover:text-gray-200">
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-1 rounded"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>

      {/* Footer */}
      <footer className="bg-white py-4 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} ABC Software (Pvt) LTD. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
