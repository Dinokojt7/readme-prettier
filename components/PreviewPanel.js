"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { FaCode, FaEye, FaPlus, FaMinus, FaTimes } from "react-icons/fa";
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
      {/* Panel Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold text-white">Preview</h3>
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
            >
              <FaMinus className="w-3 h-3" />
            </button>
            <button
              onClick={handleZoomReset}
              className="px-2 py-1 text-xs text-gray-400 hover:text-white"
            >
              {Math.round(zoomLevel * 100)}%
            </button>
            <button
              onClick={handleZoomIn}
              disabled={zoomLevel >= 2}
              className="p-1.5 text-gray-400 hover:text-white disabled:opacity-30"
            >
              <FaPlus className="w-3 h-3" />
            </button>
          </div>

          {/* Close button */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white ml-2"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden min-h-0">
        {error ? (
          <div className="h-full flex items-center justify-center text-red-400">
            {error}
          </div>
        ) : viewMode === "raw" ? (
          // Raw Markdown View
          <div className="h-full overflow-auto p-4">
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
          <div className="h-full overflow-auto p-4 md:p-6">
            <motion.div
              key="rendered-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="prose prose-invert max-w-none break-words"
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: "top left",
                fontSize: `${zoomLevel * 100}%`,
              }}
            >
              {/* Inline styles */}
              <style jsx global>{`
                /* Force proper hierarchy */
                .prose-invert h1 {
                  font-size: 2.25em !important;
                  margin-top: 0 !important;
                  margin-bottom: 0.5em !important;
                  color: #ffffff !important;
                  font-weight: 800 !important;
                }

                .prose-invert h2 {
                  font-size: 1.75em !important;
                  margin-top: 1.5em !important;
                  margin-bottom: 0.5em !important;
                  color: #f3f4f6 !important;
                  font-weight: 700 !important;
                  border-bottom: 2px solid #4b5563 !important;
                  padding-bottom: 0.3em !important;
                }

                .prose-invert h3 {
                  font-size: 1.25em !important;
                  margin-top: 1.25em !important;
                  margin-bottom: 0.5em !important;
                  color: #e5e7eb !important;
                  font-weight: 600 !important;
                }

                /* Badges - inline flex, smaller than text */
                .inline-badge {
                  display: inline-block !important;
                  margin: 0 4px 4px 0 !important;
                  vertical-align: middle !important;
                  line-height: 1 !important;
                  height: 20px !important;
                }

                .inline-badge img {
                  height: 20px !important;
                  width: auto !important;
                  max-width: none !important;
                  display: block !important;
                  margin: 0 !important;
                }

                /* Normal text */
                .prose-invert p {
                  font-size: 1em !important;
                  color: #d1d5db !important;
                  line-height: 1.6 !important;
                  margin-bottom: 1em !important;
                }

                /* Lists */
                .prose-invert li {
                  color: #d1d5db !important;
                  font-size: 0.95em !important;
                }

                /* Code */
                .prose-invert code:not(pre code) {
                  font-size: 0.85em !important;
                  background: #1f2937 !important;
                  color: #fbbf24 !important;
                  padding: 0.2em 0.4em !important;
                  border-radius: 0.25em !important;
                }

                /* Prevent long text from breaking layout */
                .prose-invert {
                  max-width: 100% !important;
                  overflow-wrap: break-word !important;
                  word-wrap: break-word !important;
                }

                /* Ensure badges don't overlap */
                .prose-invert > :first-child {
                  display: flex !important;
                  flex-wrap: wrap !important;
                  gap: 4px !important;
                  align-items: center !important;
                  margin-bottom: 1em !important;
                }
              `}</style>

              <div dangerouslySetInnerHTML={{ __html: renderedContent }} />
            </motion.div>
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
