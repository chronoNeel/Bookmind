import React, { useState } from "react";
import { Download, FileText, Loader2 } from "lucide-react";
import { Journal } from "../../../models/journal";

interface JournalPDFExporterProps {
  entry: Journal;
  className?: string;
}

const JournalPDFExporter: React.FC<JournalPDFExporterProps> = ({
  entry,
  className = "",
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    setIsGenerating(true);

    try {
      // Create HTML content for the PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=Patrick+Hand&family=Indie+Flower&display=swap');
            
            @page {
              size: A4;
              margin: 1cm;
            }
            body {
              font-family: 'Caveat', cursive;
              color: #3a3a3a;
              line-height: 1.8;
              max-width: 800px;
              margin: 0 auto;
              background: linear-gradient(to bottom, #fef9f3 0%, #fdf4e3 100%);
              position: relative;
              padding: 30px 20px;
            }
            body::before {
              content: '';
              position: absolute;
              top: 0;
              left: 80px;
              width: 2px;
              height: 100%;
              background: #f4c7a5;
              opacity: 0.4;
            }
            .header {
              text-align: center;
              padding-bottom: 20px;
              border-bottom: 2px dashed #d4a373;
              margin-bottom: 25px;
              margin-left: 20px;
              display: flex;
              flex-direction: column;
              align-items: center;
            }
            .header img {
              width: 120px;
              height: 180px;
              object-fit: cover;
              border-radius: 8px;
              box-shadow: 0 4px 8px rgba(139, 111, 71, 0.1);
              margin-bottom: 15px;
            }
            .header h1 {
              color: #8b6f47;
              font-size: 36px;
              margin: 0 0 10px 0;
              font-weight: 700;
              font-family: 'Indie Flower', cursive;
              letter-spacing: 1px;
              text-shadow: 2px 2px 4px rgba(139, 111, 71, 0.1);
            }
            .header .book-title {
              font-size: 28px;
              color: #a67c52;
              font-style: italic;
              margin: 10px 0;
              font-weight: 600;
              line-height: 1.3;
            }
            .header .author {
              color: #b8956a;
              font-size: 20px;
              font-weight: 500;
            }
            .header .journal-writer {
              color: #b8956a;
              font-size: 18px;
              font-weight: 500;
              margin-top: 5px;
            }
            .metadata {
              display: flex;
              justify-content: space-around;
              padding: 15px;
              background: rgba(254, 249, 243, 0.7);
              border-radius: 12px;
              margin-bottom: 25px;
              margin-left: 20px;
              flex-wrap: wrap;
              border: 2px solid #f4dfc8;
              box-shadow: 0 4px 6px rgba(139, 111, 71, 0.08);
            }
            .metadata-item {
              margin: 6px 8px;
              font-size: 18px;
            }
            .metadata-label {
              font-weight: 600;
              color: #8b6f47;
              font-size: 20px;
            }
            .metadata-value {
              color: #a67c52;
              font-weight: 500;
            }
            .section {
              margin-bottom: 25px;
              margin-left: 20px;
            }
            .section-title {
              font-size: 26px;
              color: #8b6f47;
              border-bottom: 2px dotted #d4a373;
              padding-bottom: 8px;
              margin-bottom: 15px;
              font-weight: 700;
              font-family: 'Patrick Hand', cursive;
            }
            .entry-text {
              font-size: 18px;
              line-height: 2.0;
              color: #4a4a4a;
              background: linear-gradient(to right, rgba(255, 251, 245, 0.5) 0%, rgba(255, 251, 245, 0.3) 100%);
              padding: 20px;
              border-radius: 10px;
              border-left: 3px solid #d4a373;
              font-weight: 500;
              text-indent: 25px;
            }
            .prompts {
              background: rgba(254, 249, 243, 0.6);
              padding: 20px;
              border-radius: 12px;
              margin-top: 20px;
              border: 2px dashed #e6c9a8;
            }
            .prompt-item {
              margin-bottom: 20px;
            }
            .prompt-question {
              font-weight: 700;
              color: #8b6f47;
              margin-bottom: 10px;
              font-size: 20px;
              font-family: 'Patrick Hand', cursive;
            }
            .prompt-answer {
              color: #5a5a5a;
              font-size: 18px;
              line-height: 2.0;
              padding-left: 15px;
              border-left: 3px solid #e6c9a8;
              font-weight: 500;
            }
            .rating {
              display: inline-block;
              background: linear-gradient(135deg, #f4c7a5 0%, #e6b08a 100%);
              color: #6b4423;
              padding: 6px 15px;
              border-radius: 20px;
              font-weight: 600;
              font-size: 18px;
              box-shadow: 0 3px 6px rgba(139, 111, 71, 0.15);
            }
            .mood {
              display: inline-block;
              background: linear-gradient(135deg, #d4a373 0%, #b8956a 100%);
              color: #f9f6f0;
              padding: 6px 15px;
              border-radius: 20px;
              font-weight: 600;
              font-size: 18px;
              box-shadow: 0 3px 6px rgba(139, 111, 71, 0.15);
            }
            .footer {
              text-align: center;
              margin-top: 50px;
              margin-left: 20px;
              padding-top: 20px;
              border-top: 2px dashed #d4a373;
              color: #b8956a;
              font-size: 16px;
              font-weight: 500;
            }
            .reading-progress {
              display: inline-block;
              background: linear-gradient(135deg, #a67c52 0%, #8b6f47 100%);
              color: #f9f6f0;
              padding: 6px 15px;
              border-radius: 20px;
              font-weight: 600;
              font-size: 18px;
              box-shadow: 0 3px 6px rgba(139, 111, 71, 0.15);
            }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="https://covers.openlibrary.org/b/id/${
              entry.bookCoverUrl
            }-M.jpg" alt="${entry.bookTitle}">
            <div class="book-title">${entry.bookTitle}</div>
            ${
              entry.bookAuthor
                ? `<div class="author">by ${entry.bookAuthor}</div>`
                : ""
            }
            <div class="journal-writer">Journal by: Demo User</div>
          </div>

          <div class="metadata">
            <div class="metadata-item">
              <span class="metadata-label">Date:</span>
              <span class="metadata-value">${new Date(
                entry.createdAt
              ).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}</span>
            </div>
            ${
              entry.rating
                ? `<div class="metadata-item">
              <span class="metadata-label">Rating:</span>
              <span class="rating">${"⭐".repeat(entry.rating)} (${
                    entry.rating
                  }/5)</span>
            </div>`
                : ""
            }
            <div class="metadata-item">
              <span class="metadata-label">Mood:</span>
              <span class="mood">${entry.mood}</span>
            </div>
            ${
              entry.readingProgress
                ? `<div class="metadata-item">
              <span class="metadata-label">Progress:</span>
              <span class="reading-progress">${entry.readingProgress}%</span>
            </div>`
                : ""
            }
          </div>

          <div class="section">
            <div class="section-title">My Thoughts</div>
            <div class="entry-text">${entry.entry.replace(/\n/g, "<br>")}</div>
          </div>

          ${
            entry.promptResponses &&
            Object.keys(entry.promptResponses).length > 0
              ? `
          <div class="section">
            <div class="section-title">Reflection Questions</div>
            <div class="prompts">
              ${Object.entries(entry.promptResponses)
                .map(
                  ([question, answer]) => `
                <div class="prompt-item">
                  <div class="prompt-question">${question}</div>
                  <div class="prompt-answer">${answer.replace(
                    /\n/g,
                    "<br>"
                  )}</div>
                </div>
              `
                )
                .join("")}
            </div>
          </div>
          `
              : ""
          }

          <div class="footer">
            Generated on ${new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </body>
        </html>
      `;

      // Create a new window for printing
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        throw new Error("Could not open print window");
      }

      // Write the HTML content
      printWindow.document.write(htmlContent);
      printWindow.document.close();

      // Wait for content to load, including images
      printWindow.onload = () => {
        // Additional delay to ensure external images load
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
          setIsGenerating(false);
        }, 1000); // Increased delay for image loading
      };
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={generatePDF}
      disabled={isGenerating}
      className={`
        inline-flex items-center gap-2 px-4 py-2.5 
        bg-amber-500 hover:bg-amber-600 
        text-white font-medium rounded-lg
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        shadow-md hover:shadow-lg
        ${className}
      `}
    >
      {isGenerating ? (
        <>
          <Loader2 size={18} className="animate-spin" />
          <span>Generating PDF...</span>
        </>
      ) : (
        <>
          <Download size={18} />
          <span>Download PDF</span>
        </>
      )}
    </button>
  );
};

export default JournalPDFExporter;
