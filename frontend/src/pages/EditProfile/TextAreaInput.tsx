import React from "react";

interface Props {
  label: string;
  name: string;
  value: string;
  placeholder?: string;
  maxLength?: number;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextAreaInput: React.FC<Props> = ({
  label,
  name,
  value,
  placeholder,
  maxLength,
  error,
  onChange,
}) => {
  const remaining = maxLength ? maxLength - value.length : 0;

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={4}
        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 resize-none border-gray-300"
      />
      <div className="flex justify-between mt-1 text-xs text-gray-500">
        <p>Share a bit about yourself</p>
        {maxLength && (
          <p className={`${remaining < 20 ? "text-red-500 font-medium" : ""}`}>
            {remaining} left
          </p>
        )}
      </div>
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
};

export default TextAreaInput;
