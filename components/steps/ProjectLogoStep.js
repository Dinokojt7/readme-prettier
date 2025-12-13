"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaUpload, FaImage, FaLink } from "react-icons/fa";
import useAppStore from "@/lib/store-persist";

export default function ProjectLogoStep() {
  const { projectLogo, updateField } = useAppStore();
  const [logoType, setLogoType] = useState("url");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateField("projectLogo", event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">Project Logo</h2>
        <p className="text-gray-400 text-sm">
          Add a logo for your project (optional). This will appear at the top of
          your README.
        </p>
      </div>

      <div className="space-y-4">
        {/* Logo Type Selection */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setLogoType("url")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              logoType === "url"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            <FaLink className="inline-block w-4 h-4 mr-2" />
            URL
          </button>
          <button
            onClick={() => setLogoType("upload")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              logoType === "upload"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            <FaUpload className="inline-block w-4 h-4 mr-2" />
            Upload
          </button>
        </div>

        {/* URL Input */}
        {logoType === "url" && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Logo URL
            </label>
            <input
              type="url"
              value={projectLogo}
              onChange={(e) => updateField("projectLogo", e.target.value)}
              placeholder="https://example.com/logo.png"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-2">
              Use a direct link to your logo image (PNG, SVG, or JPG)
            </p>
          </div>
        )}

        {/* File Upload */}
        {logoType === "upload" && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Upload Logo
            </label>
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-gray-600 transition-colors">
              <FaImage className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="logo-upload"
              />
              <label
                htmlFor="logo-upload"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer inline-block"
              >
                Choose File
              </label>
              <p className="text-sm text-gray-500 mt-2">
                PNG, JPG, or SVG up to 5MB
              </p>
            </div>
          </div>
        )}

        {/* Preview */}
        {projectLogo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 pt-6 border-t border-gray-800"
          >
            <p className="text-sm text-gray-400 mb-2">Preview:</p>
            <div className="flex items-center gap-4 p-4 bg-gray-900 rounded-lg border border-gray-800">
              <img
                src={projectLogo}
                alt="Logo preview"
                className="h-12 w-auto rounded"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentElement.innerHTML =
                    '<div class="text-red-400">Invalid image URL</div>';
                }}
              />
              <div>
                <p className="text-white font-medium">Your Logo</p>
                <p className="text-xs text-gray-400">
                  Will appear at top of README
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
