import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  marks: {
    type: Number,
    required: true,
  },
});

const studentSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    age: {
      type: Number,
      required: true,
      min: 18,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    subjects: {
      type: [subjectSchema],
      default: [
        { name: "Mathematics" },
        { name: "Science" },
        { name: "English" },
        { name: "History" },
        { name: "Religious" },
        { name: "Language" },
        { name: "Information Technology" },
        { name: "Civics" },
        { name: "Literature" },
      ],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
