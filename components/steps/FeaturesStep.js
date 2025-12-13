"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaPlus, FaTrash, FaSmile } from "react-icons/fa";
import EmojiPicker from "@/components/ui/GlobalEmojiPicker";
import useAppStore from "@/lib/store-persist";

export default function FeaturesStep() {
  const { features, addFeature, updateFeature } = useAppStore();
  const [showEmojiPicker, setShowEmojiPicker] = useState(null);
  const [pickerPosition, setPickerPosition] = useState({ x: 0, y: 0 });

  const handleAddFeature = () => {
    addFeature();
  };

  const handleRemoveFeature = (index) => {
    const newFeatures = [...features];
    newFeatures.splice(index, 1);
    updateFeature(index, "remove", null);
  };

  const handleEmojiClick = (index, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setPickerPosition({
      x: rect.left,
      y: rect.bottom + window.scrollY,
    });
    setShowEmojiPicker(index);
  };

  const handleEmojiSelect = (index, emoji) => {
    updateFeature(index, "emoji", emoji);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">Features</h2>
        <p className="text-gray-400 text-sm">
          Add features and capabilities of your project. Use emojis to make them
          stand out.
        </p>
      </div>

      <div className="space-y-4">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-start gap-3 p-4 bg-gray-900 border border-gray-800 rounded-lg"
          >
            {/* Emoji Selector */}
            <div className="relative">
              <button
                onClick={(e) => handleEmojiClick(index, e)}
                className="w-10 h-10 flex items-center justify-center bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <span className="text-xl">{feature.emoji}</span>
              </button>

              {showEmojiPicker === index && (
                <div
                  style={{
                    position: "fixed",
                    left: `${pickerPosition.x}px`,
                    top: `${pickerPosition.y}px`,
                  }}
                >
                  <EmojiPicker
                    onSelect={(emoji) => handleEmojiSelect(index, emoji)}
                    isOpen={showEmojiPicker === index}
                    onClose={() => setShowEmojiPicker(null)}
                  />
                </div>
              )}
            </div>

            {/* Feature Input */}
            <div className="flex-1">
              <input
                type="text"
                value={feature.text}
                onChange={(e) => updateFeature(index, "text", e.target.value)}
                placeholder="Describe a feature..."
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Remove Button */}
            {features.length > 1 && (
              <button
                onClick={() => handleRemoveFeature(index)}
                className="p-3 text-gray-500 hover:text-red-400 transition-colors"
              >
                <FaTrash className="w-4 h-4" />
              </button>
            )}
          </motion.div>
        ))}

        {/* Add Feature Button */}
        <button
          onClick={handleAddFeature}
          className="w-full py-3 border-2 border-dashed border-gray-800 rounded-lg text-gray-400 hover:text-white hover:border-gray-700 transition-colors flex items-center justify-center gap-2"
        >
          <FaPlus className="w-4 h-4" />
          Add Another Feature
        </button>
      </div>

      <div className="text-sm text-gray-500 pt-4 border-t border-gray-800">
        <p className="flex items-start gap-2">
          <FaSmile className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>
            Click on the emoji to change it. Use relevant emojis to make your
            features more engaging. Common patterns: 🚀 for performance, 🔧 for
            tools, 🔒 for security, 📱 for mobile.
          </span>
        </p>
      </div>
    </motion.div>
  );
}
