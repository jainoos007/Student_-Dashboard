# Student Dashboard

## 📌 Project Overview
The **Student Dashboard** is a web application that allows students to register, update their academic details, and manage their profiles. Teachers can view student details, update or delete records. The project ensures secure authentication and validation while maintaining a clean user experience.

## 🚀 Live Demo
🔗 **[Student Dashboard - Live Deployment](https://student-dashboard-production.up.railway.app/)**

## 📂 Project Structure
```
├── backend/
│   ├── app.js
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── package.json
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── contexts/
│   ├── services/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│
├── server.js
├── package.json
├── README.md
```

## ✨ Features
- **User Authentication:** Signup/Login for both Students & Teachers
- **Student Dashboard:** Update profile, marks, and upload a profile picture
- **Teacher Dashboard:** View, update, and delete student records
- **Validation Rules:** Unique email, age validation (>18 years), proper data validation
- **Email Notification:** Sends an email to students upon registration
- **Secure API:** Implemented with JWT authentication and middleware

## 🛠️ Tech Stack
### **Frontend:**
- React (Vite)
- Tailwind CSS
- React Router

### **Backend:**
- Node.js (Express)
- MongoDB (Mongoose)
- JWT Authentication
- Multer (Profile Picture Upload)
- Nodemailer (Email Notifications)

## 🛠️ Setup Instructions
### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/jainoos007/Student_-Dashboard.git
cd Student_-Dashboard
```

### **2️⃣ Set Up Environment Variables**
Create a `.env` file in the **backend/** directory with the following:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### **3️⃣ Install Dependencies**
```sh
npm install   # Install root dependencies
cd backend && npm install   # Install backend dependencies
cd ../frontend && npm install   # Install frontend dependencies
```

### **4️⃣ Run the Project Locally**
```sh
# Start Backend
cd backend
npm start

# Start Frontend
cd ../frontend
npm run dev
```

### **5️⃣ Build for Production**
```sh
cd frontend
npm run build
```

## 📜 API Routes
### **Authentication**
| Method | Route | Description |
|--------|-------------------------------|--------------------------|
| POST | `/api/auth/student/register` | Register a new student |
| POST | `/api/auth/teacher/register` | Register a new teacher |
| POST | `/api/auth/login` | Login for both users |

### **Student Routes**
| Method | Route | Description |
|--------|------------------------|------------------------------|
| GET | `/api/students` | Get all students |
| GET | `/api/students/:id` | Get a single student by ID |
| PUT | `/api/students/:id` | Update student details |
| DELETE | `/api/students/:id` | Delete a student |

### **Teacher Routes**
| Method | Route | Description |
|--------|------------------------|------------------------------|
| GET | `/api/teachers` | Get all teachers |
| GET | `/api/teachers/:id` | Get a single teacher by ID |
| PUT | `/api/teachers/:id` | Update teacher details |
| DELETE | `/api/teachers/:id` | Delete a teacher |

## 📌 Deployment
- **Frontend:** Deployed on Railway
- **Backend:** Deployed on Railway

## 🏆 Acknowledgments
- Used documentation from **MDN**, **React Docs**, and **MongoDB Docs**
- Open-source libraries: **Express, Tailwind CSS, Mongoose, JWT, Nodemailer**

## 📞 Contact
For any queries, feel free to reach out:
📧 Email: ammjainoos@gmail.com  
🔗 GitHub: https://github.com/jainoos007

