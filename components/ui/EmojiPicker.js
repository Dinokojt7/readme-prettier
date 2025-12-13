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

export default function EmojiPicker({ onSelect, isOpen, onClose }) {
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
        className="absolute z-50 mt-2 w-72 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden"
      >
        <div className="p-3 border-b border-gray-800">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search emojis..."
              className="w-full pl-10 pr-8 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white"
              >
                <FaTimes className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        <div className="max-h-60 overflow-y-auto p-3">
          {searchQuery ? (
            // Search results
            <div>
              <h3 className="text-xs font-medium text-gray-400 mb-2">
                Search Results
              </h3>
              <div className="flex flex-wrap gap-2">
                {filteredEmojis.length > 0 ? (
                  filteredEmojis.map((emoji, index) => (
                    <button
                      key={index}
                      onClick={() => handleEmojiClick(emoji)}
                      className="text-xl p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-150"
                    >
                      {emoji}
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center w-full py-4">
                    No emojis found for "{searchQuery}"
                  </p>
                )}
              </div>
            </div>
          ) : (
            // Categories
            emojiCategories.map((category) => (
              <div key={category.name} className="mb-4 last:mb-0">
                <h3 className="text-xs font-medium text-gray-400 mb-2">
                  {category.name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {category.emojis.map((emoji, index) => (
                    <button
                      key={index}
                      onClick={() => handleEmojiClick(emoji)}
                      className="text-xl p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-150"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-gray-800 p-3">
          <button
            onClick={onClose}
            className="w-full py-2 text-sm text-gray-400 hover:text-white bg-gray-800 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
