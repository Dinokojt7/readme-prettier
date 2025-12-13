"use client";

import { motion } from "framer-motion";
import useAppStore from "@/lib/store-persist";
import InputWithEmoji from "@/components/ui/InputWithEmoji";

export default function ProjectNameStep() {
  const { projectName, updateField } = useAppStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white mb-2">Project Name</h2>
        <p className="text-gray-400 text-sm">
          Start with the essentials. What's your project called?
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <InputWithEmoji
            id="project-name-input"
            value={projectName}
            onChange={(e) => updateField("projectName", e.target.value)}
            placeholder="e.g., izinto-landing-page"
            className="text-lg"
            autoFocus
          />
          <p className="text-xs text-gray-500 mt-2">
            This will be the main title of your README. Click the 😊 button to
            add emojis.
          </p>
        </div>

        {/* Live Preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-6 pt-6 border-t border-gray-800"
        >
          <p className="text-sm text-gray-400 mb-2">Preview:</p>
          <div className="px-4 py-3 bg-gray-900 rounded-lg border border-gray-800">
            <motion.h1
              key={projectName}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="text-xl font-bold text-white"
            >
              {projectName || "Your Project Name"}
            </motion.h1>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
