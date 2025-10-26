import React, { useRef } from "react";
import { Upload, Trash2, User } from "lucide-react";

interface Props {
  previewImage: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const ProfilePictureInput: React.FC<Props> = ({
  previewImage,
  onFileChange,
  error,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Profile Picture
      </label>
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
            {previewImage ? (
              <img
                src={previewImage}
                alt="preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-12 h-12 text-gray-400" />
              </div>
            )}
          </div>
        </div>

        <div className="flex-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/jpg,image/webp"
            onChange={onFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md"
          >
            <Upload className="w-4 h-4" />
            Upload Photo
          </button>
          <p className="text-xs text-gray-500 mt-2">
            JPEG, PNG, or WebP — max 5MB.
          </p>
        </div>
      </div>
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  );
};

export default ProfilePictureInput;
