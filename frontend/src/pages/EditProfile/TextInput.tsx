import React from "react";

interface Props {
  label: string;
  name: string;
  value: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
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
}) => (
  <div className="mb-6">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        error ? "border-red-300 bg-red-50" : "border-gray-300"
      } ${disabled ? "bg-gray-50 text-gray-500 cursor-not-allowed" : ""}`}
    />
    {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
  </div>
);

export default TextInput;
