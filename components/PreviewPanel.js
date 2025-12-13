"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import {
  FaCode,
  FaEye,
  FaPlus,
  FaMinus,
  FaTimes,
  FaCopy,
  FaDownload,
  FaCheck,
} from "react-icons/fa";
import useAppStore from "@/lib/store-persist";
import { generateMarkdown } from "@/lib/generateMarkdown";
import { marked } from "marked";

// Configure marked
marked.setOptions({
  gfm: true,
  breaks: true,
});

export default function PreviewPanel({ onClose }) {
  const [viewMode, setViewMode] = useState("rendered");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rawContent, setRawContent] = useState("");
  const [renderedContent, setRenderedContent] = useState("");
  const [error, setError] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const copyTimeoutRef = useRef(null);
  const downloadTimeoutRef = useRef(null);

  // Debounced update function
  const updatePreview = useCallback(() => {
    try {
      const state = useAppStore.getState();
      const markdown = generateMarkdown(state);
      setRawContent(markdown);

      // Process badges for inline display
      const badgeRegex = /(\[!\[[^\]]*\]\([^)]+\)\]\([^)]+\))/g;
      const processedMarkdown = markdown.replace(badgeRegex, (match) => {
        const badgeMatch = match.match(
          /\[!\[([^\]]*)\]\(([^)]+)\)\]\(([^)]+)\)/,
        );
        if (badgeMatch) {
          const [, alt, imageUrl, linkUrl] = badgeMatch;
          return `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" class="inline-badge">
            <img src="${imageUrl}" alt="${alt}" />
          </a>`;
        }
        return match;
      });

      const html = marked(processedMarkdown, { sanitize: false });
      setRenderedContent(html);
      setError("");
    } catch (err) {
      console.error("Error updating preview:", err);
      setError("Error generating preview");
    }
  }, []);

  // Copy to clipboard function
  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(rawContent);
      setCopySuccess(true);

      // Clear any existing timeout
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }

      // Reset success state after 2 seconds
      copyTimeoutRef.current = setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = rawContent;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopySuccess(true);

      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }

      copyTimeoutRef.current = setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
    }
  };

  // Download markdown file function
  const handleDownload = () => {
    const state = useAppStore.getState();
    const filename = `${state.projectName ? state.projectName.replace(/\s+/g, "-").toLowerCase() : "readme"}.md`;

    const blob = new Blob([rawContent], {
      type: "text/markdown;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);

    // Clear any existing timeout
    if (downloadTimeoutRef.current) {
      clearTimeout(downloadTimeoutRef.current);
    }

    // Reset success state after 2 seconds
    downloadTimeoutRef.current = setTimeout(() => {
      setDownloadSuccess(false);
    }, 2000);
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
      if (downloadTimeoutRef.current) {
        clearTimeout(downloadTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    console.log("Store state changed:", useAppStore.getState());
  }, []);

  // Subscribe to store changes
  useEffect(() => {
    // Initial update
    updatePreview();

    // Subscribe to store changes
    const unsubscribe = useAppStore.subscribe(updatePreview);

    return () => unsubscribe();
  }, [updatePreview]);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.1, 0.5));
  };

  const handleZoomReset = () => {
    setZoomLevel(1);
  };

  return (
    <div className="h-full flex flex-col min-h-0">
      {/* Panel Header - Slimmed down */}
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-4">
          <h3 className="text-md font-semibold text-white">Preview</h3>
          <div className="flex items-center gap-1 bg-gray-900 rounded-lg p-1">
            <button
              onClick={() => setViewMode("rendered")}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                viewMode === "rendered"
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <FaEye className="inline-block w-3 h-3 mr-2" />
              Rendered
            </button>
            <button
              onClick={() => setViewMode("raw")}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                viewMode === "raw"
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <FaCode className="inline-block w-3 h-3 mr-2" />
              Raw
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1 bg-gray-900 rounded-lg p-1">
            <button
              onClick={handleZoomOut}
              disabled={zoomLevel <= 0.5}
              className="p-1.5 text-gray-400 hover:text-white disabled:opacity-30"
              title="Zoom out"
            >
              <FaMinus className="w-3 h-3" />
            </button>
            <button
              onClick={handleZoomReset}
              className="px-2 py-1 text-xs text-gray-400 hover:text-white min-w-[60px] text-center"
              title="Reset zoom"
            >
              {Math.round(zoomLevel * 100)}%
            </button>
            <button
              onClick={handleZoomIn}
              disabled={zoomLevel >= 2}
              className="p-1.5 text-gray-400 hover:text-white disabled:opacity-30"
              title="Zoom in"
            >
              <FaPlus className="w-3 h-3" />
            </button>
          </div>

          {/* Close button */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white ml-1"
              title="Close preview"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Content Area with minimal floating buttons */}
      <div className="flex-1 overflow-hidden min-h-0 relative">
        {/* Minimal VS Code-style Copy/Download Buttons - Inline top right */}
        <div className="absolute top-0 right-0 z-10 flex items-center gap-3 p-2">
          <button
            onClick={handleCopyToClipboard}
            className={`flex items-center gap-1.5 text-xs transition-colors ${
              copySuccess ? "text-green-400" : "text-gray-400 hover:text-white"
            }`}
            title="Copy README to clipboard"
          >
            {copySuccess ? (
              <>
                <FaCheck className="w-3 h-3" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <FaCopy className="w-3 h-3" />
                <span>Copy</span>
              </>
            )}
          </button>

          <div className="w-px h-3 bg-gray-700"></div>

          <button
            onClick={handleDownload}
            className={`flex items-center gap-1.5 text-xs transition-colors ${
              downloadSuccess
                ? "text-green-400"
                : "text-gray-400 hover:text-white"
            }`}
            title="Download README.md file"
          >
            {downloadSuccess ? (
              <>
                <FaCheck className="w-3 h-3" />
                <span>Downloaded</span>
              </>
            ) : (
              <>
                <FaDownload className="w-3 h-3" />
                <span>Download</span>
              </>
            )}
          </button>
        </div>

        {error ? (
          <div className="h-full flex items-center justify-center text-red-400">
            {error}
          </div>
        ) : viewMode === "raw" ? (
          // Raw Markdown View
          <div className="h-full overflow-auto p-4 pt-8">
            <pre
              className="text-sm font-mono text-gray-300 whitespace-pre-wrap break-words"
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: "top left",
                maxWidth: "100%",
              }}
            >
              {rawContent}
            </pre>
          </div>
        ) : (
          // Rendered Markdown View
          <div className="h-full overflow-auto">
            <div className="preview-container relative">
              <motion.div
                key="rendered-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="prose prose-invert"
                style={{
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: "top left",
                  fontSize: `${zoomLevel * 100}%`,
                }}
              >
                {/* Inline styles */}
                <style jsx global>{`
                  /* Black background for preview area */
                  .preview-container {
                    background-color: #0d1117 !important; /* GitHub dark theme color */
                    min-height: 100% !important;
                    padding: 2rem !important;
                    position: relative;
                  }

                  /* GitHub README styling */
                  .prose-invert {
                    background-color: #0d1117 !important;
                    color: #c9d1d9 !important;
                    font-family:
                      -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica,
                      Arial, sans-serif !important;
                    line-height: 1.6 !important;
                    max-width: 800px !important;
                    margin: 0 auto !important;
                  }

                  /* Title styling */
                  .prose-invert h1 {
                    font-size: 2em !important;
                    font-weight: 600 !important;
                    color: #ffffff !important;
                    border-bottom: 1px solid #30363d !important;
                    padding-bottom: 0.3em !important;
                    margin-top: 0 !important;
                    margin-bottom: 1rem !important;
                    text-align: center !important;
                  }

                  /* Badges section - centered below title */
                  .prose-invert .inline-badge-container {
                    text-align: center !important;
                    margin-bottom: 2rem !important;
                  }

                  .prose-invert .inline-badge {
                    display: inline-block !important;
                    margin: 0 4px 8px 4px !important;
                    vertical-align: middle !important;
                  }

                  .prose-invert .inline-badge img {
                    height: 20px !important;
                    width: auto !important;
                    margin: 0 !important;
                  }

                  /* Description text (no header) */
                  .prose-invert > p:first-of-type {
                    font-size: 1.1em !important;
                    color: #c9d1d9 !important;
                    line-height: 1.7 !important;
                    margin-bottom: 2rem !important;
                    text-align: left !important;
                  }

                  /* Section headers */
                  .prose-invert h2 {
                    font-size: 1.5em !important;
                    font-weight: 600 !important;
                    color: #ffffff !important;
                    border-bottom: 1px solid #30363d !important;
                    padding-bottom: 0.3em !important;
                    margin-top: 2rem !important;
                    margin-bottom: 1rem !important;
                  }

                  .prose-invert h3 {
                    font-size: 1.25em !important;
                    font-weight: 600 !important;
                    color: #e6edf3 !important;
                    margin-top: 1.5rem !important;
                    margin-bottom: 0.75rem !important;
                  }

                  /* Lists */
                  .prose-invert ul {
                    margin-left: 1.5em !important;
                    margin-bottom: 1em !important;
                  }

                  .prose-invert li {
                    margin-bottom: 0.25em !important;
                    color: #c9d1d9 !important;
                  }

                  /* Code blocks */
                  .prose-invert code:not(pre code) {
                    background-color: #161b22 !important;
                    color: #f0f6fc !important;
                    padding: 0.2em 0.4em !important;
                    border-radius: 6px !important;
                    font-size: 85% !important;
                    font-family:
                      ui-monospace,
                      SFMono-Regular,
                      SF Mono,
                      Menlo,
                      Consolas,
                      Liberation Mono,
                      monospace !important;
                  }

                  .prose-invert pre {
                    background-color: #161b22 !important;
                    border: 1px solid #30363d !important;
                    border-radius: 6px !important;
                    padding: 1rem !important;
                    overflow-x: auto !important;
                    margin: 1rem 0 !important;
                  }

                  .prose-invert pre code {
                    background-color: transparent !important;
                    color: #e6edf3 !important;
                    padding: 0 !important;
                  }

                  /* Links */
                  .prose-invert a {
                    color: #58a6ff !important;
                    text-decoration: none !important;
                  }

                  .prose-invert a:hover {
                    text-decoration: underline !important;
                  }

                  /* Footer/Author section */
                  .prose-invert > p:last-of-type {
                    text-align: center !important;
                    color: #8b949e !important;
                    font-size: 0.9em !important;
                    margin-top: 3rem !important;
                  }

                  /* Ensure proper spacing */
                  .prose-invert > * {
                    margin-top: 0 !important;
                    margin-bottom: 1em !important;
                  }

                  .prose-invert > *:last-child {
                    margin-bottom: 0 !important;
                  }

                  .prose-invert {
                    font-size: 16px !important; /* Base size similar to GitHub */
                  }

                  /* Scale badges proportionally */
                  .prose-invert .inline-badge img {
                    height: 20px !important; /* Smaller badges */
                    transform: scale(0.95); /* Slightly smaller */
                  }

                  /* Ensure h1 is biggest, then h2, etc. */
                  .prose-invert h1 {
                    font-size: 2em !important;
                  }
                  .prose-invert h2 {
                    font-size: 1.5em !important;
                  }
                  .prose-invert h3 {
                    font-size: 1.17em !important;
                  }
                  .prose-invert p {
                    font-size: 1em !important;
                  }
                  .prose-invert li {
                    font-size: 0.95em !important;
                  }
                  .prose-invert code {
                    font-size: 0.85em !important;
                  }
                `}</style>

                <div dangerouslySetInnerHTML={{ __html: renderedContent }} />
              </motion.div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="mt-3 pt-3 border-t border-gray-800 flex-shrink-0">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div>
            {viewMode === "raw" ? (
              <span>
                Characters: {rawContent.length} • Lines:{" "}
                {rawContent.split("\n").length}
              </span>
            ) : (
              <span>
                Zoom: {Math.round(zoomLevel * 100)}% • View: {viewMode}
              </span>
            )}
          </div>
          <div className="text-gray-600">Live Preview</div>
        </div>
      </div>
    </div>
  );
}
