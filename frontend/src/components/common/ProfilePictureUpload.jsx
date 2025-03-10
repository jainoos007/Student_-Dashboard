import React, { useState } from "react";
import { FaCamera, FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import { uploadProfilePicture } from "../../services/api"; // API call function
import { useAuth } from "../../contexts/AuthContext";

const ProfilePictureUpload = ({ currentImage, onUpdateSuccess }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const { updateUser } = useAuth();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, PNG)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should not exceed 5MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload image
    uploadFile(file);
  };

  const uploadFile = async (file) => {
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("profilePicture", file);

      // Debugging: Log FormData contents
      for (let [key, value] of formData.entries()) {
        console.log("FormData Key:", key, "Value:", value);
      }

      const response = await uploadProfilePicture(formData);

      if (!response.profilePicture) {
        throw new Error("Upload failed, no profile picture URL received");
      }

      updateUser({ profilePicture: response.profilePicture });

      if (onUpdateSuccess) {
        onUpdateSuccess(response.profilePicture);
      }

      toast.success("Profile picture updated successfully");
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error(error.message || "Failed to upload profile picture");
      setPreviewImage(null);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center mb-6">
      <div className="relative">
        <div className="h-32 w-32 rounded-full overflow-hidden bg-gray-200 mb-3">
          {previewImage ? (
            <img
              src={previewImage}
              alt="Profile Preview"
              className="h-full w-full object-cover"
            />
          ) : currentImage ? (
            <img
              src={currentImage}
              alt="Profile"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-blue-100">
              <FaCamera className="text-blue-600 text-4xl" />
            </div>
          )}
        </div>

        <label
          htmlFor="profile-picture-upload"
          className="absolute bottom-2 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition"
          title="Upload profile picture"
        >
          {isUploading ? <FaSpinner className="animate-spin" /> : <FaCamera />}
        </label>

        <input
          type="file"
          id="profile-picture-upload"
          className="hidden"
          accept="image/jpeg, image/png"
          onChange={handleImageChange}
          disabled={isUploading}
        />
      </div>

      <p className="text-sm text-gray-500 mt-2">
        Click the camera icon to upload a profile picture
      </p>
    </div>
  );
};

export default ProfilePictureUpload;
