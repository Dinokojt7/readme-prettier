"use client";

import { FaEye, FaEyeSlash } from "react-icons/fa";
import useAppStore from "@/lib/store";

export default function PreviewToggle() {
  const { isPreviewMaximized, updateField } = useAppStore();

  return (
    <button
      onClick={() => updateField("isPreviewMaximized", !isPreviewMaximized)}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-700 text-white rounded-lg hover:bg-gray-800 transition-all duration-200 shadow-lg"
    >
      {isPreviewMaximized ? (
        <>
          <FaEyeSlash className="w-4 h-4" />
          Hide Preview
        </>
      ) : (
        <>
          <FaEye className="w-4 h-4" />
          Show Preview
        </>
      )}
    </button>
  );
}
