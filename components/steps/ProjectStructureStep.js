"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaFolder, FaFile, FaIndent, FaCode } from "react-icons/fa";
import useAppStore from "@/lib/store-persist";

const structureTemplates = [
  {
    name: "Next.js App Router",
    value: `src/
├── app/
│   ├── (routes)/
│   ├── api/
│   └── globals.css
├── components/
│   ├── ui/
│   └── layout/
├── lib/
│   ├── utils/
│   └── api/
└── public/`,
  },
  {
    name: "React + Vite",
    value: `src/
├── components/
│   ├── common/
│   └── features/
├── hooks/
├── utils/
├── styles/
├── assets/
└── App.jsx`,
  },
  {
    name: "Node.js API",
    value: `src/
├── controllers/
├── models/
├── routes/
├── middleware/
├── utils/
├── config/
└── server.js`,
  },
];

export default function ProjectStructureStep() {
  const { projectStructure, updateField } = useAppStore();
  const [selectedTemplate, setSelectedTemplate] = useState("");

  const applyTemplate = (template) => {
    updateField("projectStructure", template);
    setSelectedTemplate(template);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">
          Project Structure
        </h2>
        <p className="text-gray-400 text-sm">
          Add your project's file structure or choose from templates.
        </p>
      </div>

      <div className="space-y-4">
        {/* Template Selection */}
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-3">
            Quick Templates
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {structureTemplates.map((template) => (
              <button
                key={template.name}
                onClick={() => applyTemplate(template.value)}
                className={`p-4 border rounded-lg transition-all ${
                  selectedTemplate === template.value
                    ? "bg-blue-900/20 border-blue-500 ring-1 ring-blue-500/30"
                    : "bg-gray-900 border-gray-800 hover:bg-gray-800"
                }`}
              >
                <FaFolder className="w-5 h-5 text-blue-400 mb-2" />
                <p className="text-sm font-medium text-white">
                  {template.name}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Structure Editor */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Project Structure
          </label>
          <div className="relative">
            <FaCode className="absolute left-4 top-4 text-gray-500 w-4 h-4" />
            <textarea
              value={projectStructure}
              onChange={(e) => updateField("projectStructure", e.target.value)}
              placeholder={`src/
├── app/
│   ├── page.js
│   └── layout.js
├── components/
├── lib/
└── package.json`}
              rows={12}
              className="w-full pl-12 pr-4 py-4 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Use tree structure format with proper indentation
          </p>
        </div>

        {/* Preview */}
        {projectStructure && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 pt-6 border-t border-gray-800"
          >
            <p className="text-sm text-gray-400 mb-2">Preview:</p>
            <div className="p-4 bg-gray-900 rounded-lg border border-gray-800">
              <pre className="text-sm text-gray-300 font-mono whitespace-pre overflow-x-auto">
                {projectStructure}
              </pre>
            </div>
          </motion.div>
        )}
      </div>

      <div className="text-sm text-gray-500 pt-4 border-t border-gray-800">
        <p>
          💡 Use proper indentation (2-4 spaces) for the tree structure. This
          helps readers understand your project organization.
        </p>
      </div>
    </motion.div>
  );
}
