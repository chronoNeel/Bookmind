import React from "react";
import { Loader2 } from "lucide-react";

interface Props {
  onSave: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const Buttons: React.FC<Props> = ({ onSave, onCancel, isLoading }) => (
  <div className="flex gap-3 pt-4">
    <button
      onClick={onSave}
      disabled={isLoading}
      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-md"
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Saving...
        </>
      ) : (
        "Save Changes"
      )}
    </button>
    <button
      onClick={onCancel}
      disabled={isLoading}
      className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 font-medium rounded-md"
    >
      Cancel
    </button>
  </div>
);

export default Buttons;
