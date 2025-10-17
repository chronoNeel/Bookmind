import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../hooks/redux";
import api from "../../utils/api";

import ProfilePictureInput from "./ProfilePictureInput";
import TextInput from "./TextInput";
import TextAreaInput from "./TextAreaInput";
import Buttons from "./Buttons";

interface ProfileData {
  fullName: string;
  username: string;
  bio: string;
  profilePicture: string | null;
  email: string;
}

const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = useAppSelector((state) => state.auth.user);

  const [formData, setFormData] = useState<ProfileData>({
    fullName: "",
    username: "",
    bio: "",
    profilePicture: null,
    email: "",
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const BIO_MAX_LENGTH = 160;

  useEffect(() => {
    if (currentUser) {
      setFormData({
        fullName: currentUser.fullName,
        username: currentUser.userName,
        bio: currentUser.bio || "",
        profilePicture: currentUser.profilePic || null,
        email: currentUser.email,
      });
      setPreviewImage(currentUser.profilePic || null);
    }
  }, [currentUser]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "bio" && value.length > BIO_MAX_LENGTH) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setSelectedFile(null);
    setFormData((prev) => ({ ...prev, profilePicture: null }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const payload = new FormData();
      payload.append("fullName", formData.fullName);
      payload.append("username", formData.username);
      payload.append("bio", formData.bio);
      if (selectedFile) payload.append("profilePicture", selectedFile);

      await api.put("/api/users/me", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Profile updated!");
      navigate(-1);
    } catch (err) {
      setErrors({ general: "Failed to update profile" });
    } finally {
      setIsLoading(false);
    }
  };

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
              onRemove={handleRemoveImage}
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
              name="username"
              value={formData.username}
              placeholder="Choose a username"
              required
              onChange={handleInputChange}
              error={errors.username}
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
