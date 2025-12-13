"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSmile, FaSearch, FaTimes } from "react-icons/fa";

const emojiCategories = [
  {
    name: "Popular",
    emojis: ["🚀", "✨", "🔥", "🎉", "📦", "🔧", "⚡", "💡", "🎨", "🛠️"],
  },
  {
    name: "Tech",
    emojis: ["💻", "📱", "🔗", "🌐", "📡", "🔒", "📊", "📈", "🎯", "⚙️"],
  },
  {
    name: "Files",
    emojis: ["📄", "📁", "📂", "📝", "✏️", "📎", "📌", "📍", "🗂️", "🗃️"],
  },
  {
    name: "Symbols",
    emojis: ["⭐", "✅", "❌", "⚠️", "ℹ️", "❗", "❓", "➕", "➖", "➡️"],
  },
  {
    name: "Nature",
    emojis: ["🌱", "🌲", "🌍", "☀️", "🌙", "⭐", "🌈", "🔥", "💧", "🌪️"],
  },
  {
    name: "Objects",
    emojis: ["🏠", "🏢", "🏭", "🏛️", "🎪", "🏟️", "📦", "🎁", "📫", "📮"],
  },
];

export default function GlobalEmojiPicker({ isOpen, onClose, onSelect }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEmojis, setFilteredEmojis] = useState([]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const allEmojis = emojiCategories.flatMap((cat) => cat.emojis);
      const filtered = allEmojis.filter((emoji) =>
        emoji.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredEmojis(filtered);
    } else {
      setFilteredEmojis([]);
    }
  }, [searchQuery]);

  const handleEmojiClick = (emoji) => {
    // Simply pass the emoji to parent
    onSelect(emoji);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.95 }}
          className="w-full max-w-md bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-white">Select Emoji</h3>
              <button
                onClick={onClose}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search emojis..."
                className="w-full pl-10 pr-8 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  <FaTimes className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="max-h-96 overflow-y-auto p-4">
            {searchQuery ? (
              // Search Results
              <div>
                <h4 className="text-xs font-medium text-gray-400 mb-3">
                  Search Results
                </h4>
                {filteredEmojis.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {filteredEmojis.map((emoji, index) => (
                      <button
                        key={index}
                        onClick={() => handleEmojiClick(emoji)}
                        className="text-2xl p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-150"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      No emojis found for "{searchQuery}"
                    </p>
                  </div>
                )}
              </div>
            ) : (
              // Categories
              emojiCategories.map((category) => (
                <div key={category.name} className="mb-6 last:mb-0">
                  <h4 className="text-xs font-medium text-gray-400 mb-3">
                    {category.name}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {category.emojis.map((emoji, index) => (
                      <button
                        key={index}
                        onClick={() => handleEmojiClick(emoji)}
                        className="text-2xl p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-150"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-800">
            <button
              onClick={onClose}
              className="w-full py-2.5 text-sm text-gray-300 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
