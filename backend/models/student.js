import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  marks: {
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
        { name: "Relegious" },
        { name: "Language" },
        { name: "Information Technology" },
        { name: "Civics" },
        { name: "Literature" },
      ],
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
