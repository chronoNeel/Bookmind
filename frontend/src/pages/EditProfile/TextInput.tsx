import React from "react";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

interface Props {
  label: string;
  name: string;
  value: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  isChecking?: boolean;
  isAvailable?: boolean | null;
  showAvailability?: boolean;
}

const TextInput: React.FC<Props> = ({
  label,
  name,
  value,
  placeholder,
  required,
  error,
  onChange,
  disabled,
  isChecking = false,
  isAvailable = null,
  showAvailability = false,
}) => (
  <div className="mb-6">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? "border-red-300 bg-red-50" : "border-gray-300"
        } ${disabled ? "bg-gray-50 text-gray-500 cursor-not-allowed" : ""} ${
          showAvailability ? "pr-10" : ""
        }`}
      />
      {showAvailability && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {isChecking && (
            <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
          )}
          {!isChecking && isAvailable === true && (
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          )}
          {!isChecking && isAvailable === false && (
            <XCircle className="w-5 h-5 text-red-500" />
          )}
        </div>
      )}
    </div>
    {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    {showAvailability && !error && !isChecking && isAvailable === true && (
      <p className="text-sm text-green-600 mt-1">Username is available!</p>
    )}
    {showAvailability && !error && !isChecking && isAvailable === false && (
      <p className="text-sm text-red-600 mt-1">Username is already taken</p>
    )}
  </div>
);

export default TextInput;
