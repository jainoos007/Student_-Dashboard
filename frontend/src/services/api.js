import axios from "axios";

const API_URL = "http://localhost:3000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Authentication API calls

// Using callback pattern
export const registerStudent = (userData, successCallback, errorCallback) => {
  api
    .post("/auth/student/register", userData)
    .then((response) => {
      if (successCallback) successCallback(response.data);
    })
    .catch((error) => {
      if (errorCallback)
        errorCallback(error.response?.data || { message: "An error occurred" });
    });
};

// Using promise pattern
export const loginStudent = (credentials) => {
  return new Promise((resolve, reject) => {
    api
      .post("/auth/student/login", credentials)
      .then((response) => resolve(response.data))
      .catch((error) =>
        reject(error.response?.data || { message: "An error occurred" })
      );
  });
};

// Using async/await pattern
export const registerTeacher = async (userData) => {
  try {
    const response = await api.post("/auth/teacher/register", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "An error occurred" };
  }
};

export const loginTeacher = async (credentials) => {
  try {
    const response = await api.post("/auth/teacher/login", credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "An error occurred" };
  }
};

// Student API calls
export const getStudentProfile = async () => {
  try {
    const response = await api.get("/students/profile");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "An error occurred" };
  }
};

export const updateStudentProfile = async (profileData) => {
  try {
    const response = await api.put("/students/profile", profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "An error occurred" };
  }
};

export const updateStudentMarks = async (marksData) => {
  try {
    const response = await api.put("/students/marks", marksData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "An error occurred" };
  }
};

export const uploadProfilePicture = async (formData) => {
  try {
    const response = await api.post("/students/profile/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Upload error:", error); // Log for debugging
    throw (
      error.response?.data || { message: error.message || "An error occurred" }
    );
  }
};

// Teacher API calls
export const getAllStudents = async () => {
  try {
    const response = await api.get("/teachers/students");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "An error occurred" };
  }
};

export const getStudentById = async (studentId) => {
  try {
    const response = await api.get(`/teachers/students/${studentId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "An error occurred" };
  }
};

export const updateStudent = async (studentId, studentData) => {
  try {
    const response = await api.put(
      `/teachers/students/${studentId}`,
      studentData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "An error occurred" };
  }
};

export const deleteStudent = async (studentId) => {
  try {
    const response = await api.delete(`/teachers/students/${studentId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "An error occurred" };
  }
};

export default api;
