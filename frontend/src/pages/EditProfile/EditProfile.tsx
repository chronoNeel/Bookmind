import React, { useEffect, useState, useRef, useCallback } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../hooks/redux";
import api from "../../utils/api";
import {
  checkUsernameAvailability,
  resetUsernameCheck,
} from "../../store/slices/authSlice";

import ProfilePictureInput from "./ProfilePictureInput";
import TextInput from "./TextInput";
import TextAreaInput from "./TextAreaInput";
import Buttons from "./Buttons";

interface ProfileData {
  fullName: string;
  userName: string;
  bio: string;
  profilePicture: string | null;
  email: string;
}

const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.user);
  const usernameCheck = useAppSelector((state) => state.auth.usernameCheck);

  const [formData, setFormData] = useState<ProfileData>({
    fullName: "",
    userName: "",
    bio: "",
    profilePicture: null,
    email: "",
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [originalUsername, setOriginalUsername] = useState("");

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const BIO_MAX_LENGTH = 160;

  useEffect(() => {
    if (currentUser) {
      setFormData({
        fullName: currentUser.fullName || "",
        userName: currentUser.userName || "",
        bio: currentUser.bio || "",
        profilePicture: currentUser.profilePic || null,
        email: currentUser.email || "",
      });
      setPreviewImage(currentUser.profilePic || null);
      setOriginalUsername(currentUser.userName || "");
    }
  }, [currentUser]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      dispatch(resetUsernameCheck());
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [dispatch]);

  // Debounced username check
  const checkUsername = useCallback(
    (username: string) => {
      // Clear any existing timer
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      // Reset username check state
      dispatch(resetUsernameCheck());

      // If username is empty or same as original, don't check
      if (!username || username === originalUsername) {
        return;
      }

      // Basic validation
      if (username.length < 3 || username.length > 30) {
        setErrors((prev: any) => ({
          ...prev,
          userName: "Username must be 3-30 characters",
        }));
        return;
      }

      if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
        setErrors((prev: any) => ({
          ...prev,
          userName:
            "Username can only contain letters, numbers, underscores, and hyphens",
        }));
        return;
      }

      // Clear error
      setErrors((prev: any) => ({
        ...prev,
        userName: undefined,
      }));

      // Set new timer
      debounceTimer.current = setTimeout(() => {
        dispatch(checkUsernameAvailability(username));
      }, 500);
    },
    [dispatch, originalUsername]
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "bio" && value.length > BIO_MAX_LENGTH) return;

    setFormData((prev) => ({ ...prev, [name]: value }));

    // Trigger username check if username field changed
    if (name === "userName") {
      checkUsername(value);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      setErrors({ profilePicture: "Invalid image format" });
      return;
    }
    if (file.size > maxSize) {
      setErrors({ profilePicture: "File must be under 5MB" });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result as string);
    reader.readAsDataURL(file);
    setSelectedFile(file);
    setErrors({ profilePicture: undefined });
  };

  const uploadToCloudinary = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "bookmind");
    formData.append("folder", "bookmind/profile_pics");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dlwmqiwvv/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.error?.message || "Upload failed");
      return data.secure_url;
    } catch (error) {
      console.error("Cloudinary upload failed:", error);
      return null;
    }
  };

  const handleSave = async () => {
    // Validate username availability before saving
    if (
      formData.userName !== originalUsername &&
      usernameCheck.available === false
    ) {
      setErrors((prev: any) => ({
        ...prev,
        userName: "Username is already taken",
      }));
      return;
    }

    // Check if still checking username
    if (usernameCheck.checking) {
      setErrors((prev: any) => ({
        ...prev,
        general: "Please wait for username validation",
      }));
      return;
    }

    setIsLoading(true);
    try {
      let imageUrl = formData.profilePicture;

      if (selectedFile) {
        const uploadedUrl = await uploadToCloudinary(selectedFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          setErrors({ profilePicture: "Image upload failed" });
          setIsLoading(false);
          return;
        }
      }

      const payload = {
        fullName: formData.fullName,
        userName: formData.userName,
        bio: formData.bio,
        profilePic: imageUrl,
      };

      await api.put("/api/users/update", payload);
      navigate(`/profile/${payload.userName}`);
    } catch (err) {
      console.error(err);
      setErrors({ general: "Failed to update profile" });
    } finally {
      setIsLoading(false);
    }
  };

  // Determine if username should show availability status
  const shouldShowUsernameStatus =
    formData.userName !== originalUsername && formData.userName.length >= 3;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="relative p-4 md:p-8 max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Edit Profile</h1>
            <div className="w-9" />
          </div>
          <div className="p-6">
            <ProfilePictureInput
              previewImage={previewImage}
              onUploadClick={() => {}}
              onFileChange={handleFileChange}
              error={errors.profilePicture}
            />
            <TextInput
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              placeholder="Enter your name"
              required
              onChange={handleInputChange}
              error={errors.fullName}
            />
            <TextInput
              label="Username"
              name="userName"
              value={formData.userName}
              placeholder="Choose a username"
              required
              onChange={handleInputChange}
              error={errors.userName}
              isChecking={usernameCheck.checking}
              isAvailable={usernameCheck.available}
              showAvailability={shouldShowUsernameStatus}
            />
            <TextAreaInput
              label="Bio"
              name="bio"
              value={formData.bio}
              maxLength={BIO_MAX_LENGTH}
              onChange={handleInputChange}
              error={errors.bio}
            />
            <TextInput
              label="Email"
              name="email"
              value={formData.email}
              disabled
              onChange={handleInputChange}
            />
            {errors.general && (
              <p className="text-red-600 mt-2">{errors.general}</p>
            )}
            <Buttons
              onSave={handleSave}
              onCancel={() => navigate(-1)}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
