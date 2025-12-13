"use client";

import { motion } from "framer-motion";
import useAppStore from "@/lib/store-persist";
import InputWithEmoji from "@/components/ui/InputWithEmoji";

export default function DescriptionStep() {
  const { projectDescription, updateField } = useAppStore();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">Description</h2>
        <p className="text-gray-400 text-sm">
          Describe what your project does, who it's for, and why it exists.
        </p>
      </div>

      <InputWithEmoji
        id="project-description-input"
        value={projectDescription}
        onChange={(e) => updateField("projectDescription", e.target.value)}
        placeholder="A modern web application that helps users create beautiful README files with a guided, step-by-step interface..."
        type="textarea"
        rows={6}
      />
    </motion.div>
  );
}
