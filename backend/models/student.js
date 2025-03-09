import mongoose from "mongoose";
import bcrypt from "bcrypt";

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  mark: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
});

const studentSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [18, "Age must be at least 18"],
    },
    profilePicture: {
      type: String,
      default: "",
    },
    subjects: [subjectSchema],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Pre-save hook to hash the password before saving
studentSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) {
    return next();
  }

  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password with the salt
    const hashedPassword = await bcrypt.hash(this.password, salt);
    // Replace the plain text password with the hashed one
    this.password = hashedPassword;
    next();
  } catch (err) {
    next(err);
  }
});

studentSchema.pre("save", function (next) {
  if (this.isNew && (!this.subjects || this.subjects.length === 0)) {
    this.subjects = [
      { name: "Mathematics", mark: 0 },
      { name: "Science", mark: 0 },
      { name: "English", mark: 0 },
      { name: "History", mark: 0 },
      { name: "Geography", mark: 0 },
      { name: "Computer Science", mark: 0 },
      { name: "Physics", mark: 0 },
      { name: "Chemistry", mark: 0 },
      { name: "Biology", mark: 0 },
    ];
  }
  next();
});

// Method to compare passwords
studentSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    // Compare the candidate password with the hashed password
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (err) {
    throw err;
  }
};

export default mongoose.model("Student", studentSchema);
