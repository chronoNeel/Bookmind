import React from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputFieldProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: React.ReactNode;
  toggleVisibility?: () => void;
  showPassword?: boolean;
  required?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  type,
  placeholder,
  value,
  onChange,
  icon,
  toggleVisibility,
  showPassword,
  required = false,
}) => {
  return (
    <div className="input-group-custom">
      <div className="input-icon">{icon}</div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="form-control-custom"
        required={required}
      />
      {toggleVisibility && (
        <button
          type="button"
          onClick={toggleVisibility}
          className="btn-toggle"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="icon-size" />
          ) : (
            <Eye className="icon-size" />
          )}
        </button>
      )}
    </div>
  );
};

export default InputField;
