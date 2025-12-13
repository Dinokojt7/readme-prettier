"use client";

import { marked } from "marked";
import useAppStore from "@/lib/store";
import { generateMarkdown } from "@/lib/generateMarkdown";

export default function PreviewPanel() {
  const { isPreviewMaximized } = useAppStore();

  // Get current state and generate markdown
  const markdownContent = generateMarkdown(useAppStore.getState());

  // Convert markdown to HTML
  const htmlContent = marked(markdownContent);

  return (
    <div className={`${isPreviewMaximized ? "fixed inset-4 z-40" : "h-full"}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Live Preview</h3>
        <div className="text-xs text-gray-500">Updates as you type</div>
      </div>

      <div
        className={`bg-white rounded-lg overflow-hidden ${isPreviewMaximized ? "h-[calc(100vh-8rem)]" : "h-125"}`}
      >
        <div className="h-full overflow-y-auto p-6 prose prose-sm max-w-none">
          {/* Raw markdown preview */}
          <div className="mb-6 p-4 bg-gray-50 rounded border">
            <pre className="text-xs text-gray-600 whitespace-pre-wrap">
              {markdownContent.substring(0, 500)}
              {markdownContent.length > 500 ? "..." : ""}
            </pre>
          </div>

          {/* Rendered markdown preview */}
          <div
            className="prose prose-headings:font-bold prose-p:text-gray-700 prose-li:text-gray-600 max-w-none"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </div>
      </div>
    </div>
  );
}
