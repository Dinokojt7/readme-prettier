"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaCheck, FaSync } from "react-icons/fa";
import useAppStore from "@/lib/store-persist";

export default function SavePreviewButton() {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  const handleSave = () => {
    setIsSaving(true);

    // Force state persistence and preview update
    setTimeout(() => {
      setIsSaving(false);
      setLastSaved(new Date());

      // Trigger a custom event to refresh preview
      window.dispatchEvent(new Event("preview-update"));
    }, 500);
  };

  return (
    <div className="flex items-center gap-3">
      {lastSaved && (
        <span className="text-xs text-gray-500">
          Saved{" "}
          {lastSaved.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      )}

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSave}
        disabled={isSaving}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {isSaving ? (
          <>
            <FaSync className="w-4 h-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <FaCheck className="w-4 h-4" />
            Save & Update Preview
          </>
        )}
      </motion.button>
    </div>
  );
}
