import { ChevronDown, ChevronUp } from "lucide-react";

interface Prompt {
  id: string;
  question: string;
  placeholder: string;
}

interface GuidedPromptsProps {
  expandedPrompts: { [key: string]: boolean };
  setExpandedPrompts: React.Dispatch<
    React.SetStateAction<{ [key: string]: boolean }>
  >;
  promptResponses: { [key: string]: string };
  setPromptResponses: React.Dispatch<
    React.SetStateAction<{ [key: string]: string }>
  >;
}

const prompts: Prompt[] = [
  {
    id: "character",
    question: "What character do you relate to most?",
    placeholder: "Describe which character resonates with you and why...",
  },
  {
    id: "summary",
    question: "One sentence summary of your current reading",
    placeholder: "Capture the essence of where you are in the story...",
  },
  {
    id: "change",
    question: "What would you change if you were the author?",
    placeholder: "Share your creative ideas for the story...",
  },
  {
    id: "quote",
    question: "Favorite quote or memorable line",
    placeholder: "Any quote that stood out to you...",
  },
];

const GuidedPrompts: React.FC<GuidedPromptsProps> = ({
  expandedPrompts,
  setExpandedPrompts,
  promptResponses,
  setPromptResponses,
}) => {
  const togglePrompt = (id: string) => {
    setExpandedPrompts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleResponse = (id: string, value: string) => {
    setPromptResponses((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Guided Prompts
      </h3>
      <div className="space-y-3">
        {prompts.map((prompt) => (
          <div key={prompt.id} className="border border-gray-200 rounded-lg">
            <button
              onClick={() => togglePrompt(prompt.id)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors text-gray-900"
            >
              <span className="font-medium">{prompt.question}</span>
              {expandedPrompts[prompt.id] ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
            {expandedPrompts[prompt.id] && (
              <div className="p-4 border-t border-gray-200 animate-in slide-in-from-top-2 duration-200">
                <textarea
                  value={promptResponses[prompt.id] || ""}
                  onChange={(e) => handleResponse(prompt.id, e.target.value)}
                  placeholder={prompt.placeholder}
                  className="w-full h-20 p-3 border border-gray-200 rounded-lg focus:border-amber-400 focus:outline-none resize-none font-serif text-gray-800"
                  style={{ fontFamily: "Georgia, serif" }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GuidedPrompts;
