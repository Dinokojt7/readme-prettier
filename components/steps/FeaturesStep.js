"use client";

import { motion } from "framer-motion";
import useAppStore from "@/lib/store";

export default function FeaturesStep() {
  const { projectDescription, updateField } = useAppStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-semibold text-white mb-4">
        Project Features
      </h2>
      <textarea
        value={projectDescription}
        onChange={(e) => updateField("projectFeatures", e.target.value)}
        className="w-full h-48 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Describe what your project does, why it exists, and who it's for..."
      />
    </motion.div>
  );
}
