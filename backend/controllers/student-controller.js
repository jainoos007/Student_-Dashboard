import Student from "../models/student.js";
import streamifier from "streamifier";
import cloudinary from "cloudinary";
import dotenv from "dotenv";

dotenv.config();
// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Get student profile
export const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user._id);

    if (student) {
      res.json({
        _id: student._id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        age: student.age,
        profilePicture: student.profilePicture,
        subjects: student.subjects,
      });
    } else {
      res.status(404);
      throw new Error("Student not found");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update student profile
export const updateStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user._id);

    if (student) {
      student.firstName = req.body.firstName || student.firstName;
      student.lastName = req.body.lastName || student.lastName;
      student.email = req.body.email || student.email;
      student.age = req.body.age || student.age;

      if (req.body.password) {
        student.password = req.body.password;
      }

      const updatedStudent = await student.save();

      res.json({
        _id: updatedStudent._id,
        firstName: updatedStudent.firstName,
        lastName: updatedStudent.lastName,
        email: updatedStudent.email,
        age: updatedStudent.age,
        profilePicture: updatedStudent.profilePicture,
      });
    } else {
      res.status(404);
      throw new Error("Student not found");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload profile picture
// export const uploadProfilePicture = async (req, res) => {
//   const uploadSingle = upload.single("profilePicture");

//   uploadSingle(req, res, async function (err) {
//     if (err) {
//       return res.status(400).json({ message: err.message });
//     }

//     if (!req.file) {
//       return res.status(400).json({ message: "Please upload an image file" });
//     }

//     try {
//       const student = await Student.findById(req.user._id);

//       if (student) {
//         // Delete old profile picture if exists
//         if (student.profilePicture) {
//           const oldImagePath = path.join(
//             __dirname,
//             "..",
//             student.profilePicture
//           );
//           if (fs.existsSync(oldImagePath)) {
//             fs.unlinkSync(oldImagePath);
//           }
//         }

//         // Update profile picture path
//         student.profilePicture = `/uploads/${req.file.filename}`;
//         await student.save();

//         res.json({
//           message: "Profile picture uploaded successfully",
//           profilePicture: student.profilePicture,
//         });
//       } else {
//         res.status(404);
//         throw new Error("Student not found");
//       }
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   });
// };

// Upload Profile Picture using Cloudinary
export const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.files || !req.files.profilePicture) {
      return res.status(400).json({ message: "Please upload an image file" });
    }

    const student = await Student.findById(req.user._id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const file = req.files.profilePicture;
    console.log("Received file:", file.name); // Debugging

    // Delete old profile picture if it exists
    if (student.cloudinaryPublicId) {
      await cloudinary.v2.uploader.destroy(student.cloudinaryPublicId);
    }

    // Upload new image to Cloudinary
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      {
        folder: "student_profiles",
        transformation: [{ width: 300, height: 300, crop: "fill" }],
        resource_type: "image",
      },
      async (error, result) => {
        if (error) {
          return res
            .status(500)
            .json({ message: "Cloudinary upload failed", error });
        }

        // Save new image URL & public ID
        student.profilePicture = result.secure_url;
        student.cloudinaryPublicId = result.public_id;
        await student.save();

        res.json({
          message: "Profile picture uploaded successfully",
          profilePicture: student.profilePicture,
        });
      }
    );

    streamifier.createReadStream(file.data).pipe(uploadStream);
  } catch (error) {
    console.error("Upload Error:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// Update student marks
export const updateStudentMarks = async (req, res) => {
  try {
    const student = await Student.findById(req.user._id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const { subjects } = req.body;

    if (!subjects || !Array.isArray(subjects)) {
      return res.status(400).json({ message: "Invalid subjects data" });
    }

    // Validate subject data
    for (let i = 0; i < subjects.length; i++) {
      const subjectData = subjects[i];

      if (!subjectData._id) {
        return res.status(400).json({ message: "Subject ID is required" });
      }

      const mark = Number(subjectData.mark);
      if (isNaN(mark) || mark < 0 || mark > 100) {
        return res
          .status(400)
          .json({ message: "Mark must be a number between 0 and 100" });
      }

      // Find and update the subject
      const subjectIndex = student.subjects.findIndex(
        (s) => s._id.toString() === subjectData._id
      );

      if (subjectIndex === -1) {
        return res
          .status(404)
          .json({ message: `Subject with ID ${subjectData._id} not found` });
      }

      student.subjects[subjectIndex].mark = mark;
    }

    await student.save();

    res.json({
      message: "Marks updated successfully",
      subjects: student.subjects,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
