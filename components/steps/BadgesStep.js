"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaTimes, FaCheck, FaTag } from "react-icons/fa";
import useAppStore, { badgeConfig, searchBadges } from "@/lib/store";

// Category configuration
const categories = [
  { id: "all", label: "All", color: "bg-gray-800" },
  { id: "framework", label: "Frameworks", color: "bg-blue-900/30" },
  { id: "styling", label: "Styling", color: "bg-purple-900/30" },
  { id: "backend", label: "Backend", color: "bg-green-900/30" },
  { id: "database", label: "Databases", color: "bg-yellow-900/30" },
  { id: "language", label: "Languages", color: "bg-red-900/30" },
  { id: "tool", label: "Tools", color: "bg-indigo-900/30" },
  { id: "deployment", label: "Deployment", color: "bg-gray-700" },
  { id: "license", label: "License", color: "bg-teal-900/30" },
  { id: "status", label: "Status", color: "bg-pink-900/30" },
];

export default function BadgesStep() {
  const { badges, addBadge } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Filter badges based on search and category
  useEffect(() => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      const results = searchBadges(searchQuery);
      setSearchResults(results);
    } else {
      setIsSearching(false);
      setSearchResults([]);
    }
  }, [searchQuery]);

  // Get badges to display
  const getDisplayBadges = () => {
    if (searchResults.length > 0) {
      return searchResults;
    }

    return Object.entries(badgeConfig)
      .filter(
        ([id, badge]) =>
          selectedCategory === "all" || badge.category === selectedCategory,
      )
      .map(([id, badge]) => ({ id, ...badge }));
  };

  const displayBadges = getDisplayBadges();

  // Handle badge click
  const handleBadgeClick = (badgeId) => {
    addBadge(badgeId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">
          Select Badges
        </h2>
        <p className="text-gray-400 text-sm">
          Choose badges to showcase your tech stack. Search or browse by
          category.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search badges (e.g., React, Node.js, MIT License)..."
            className="w-full pl-12 pr-10 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Search Results Count */}
        <AnimatePresence>
          {isSearching && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-sm text-gray-500 mt-2"
            >
              Found {searchResults.length} badge
              {searchResults.length !== 1 ? "s" : ""}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Category Filters */}
      <div>
        <h3 className="text-sm font-medium text-gray-400 mb-3">
          Browse by Category
        </h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-1.5 text-xs rounded-full transition-all duration-200 ${
                selectedCategory === category.id
                  ? `${category.color} text-white border border-gray-600`
                  : "bg-gray-900 text-gray-400 hover:bg-gray-800 border border-gray-800"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Badges Preview */}
      {badges.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="border border-gray-800 rounded-lg p-4 bg-gray-900/50"
        >
          <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
            <FaCheck className="w-3 h-3 text-green-400" />
            Selected Badges ({badges.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {badges.map((badgeId) => {
              const badge = badgeConfig[badgeId];
              if (!badge) return null;
              return (
                <motion.div
                  key={badgeId}
                  layoutId={`badge-${badgeId}`}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg"
                >
                  <span className="text-xs text-white">{badge.label}</span>
                  <button
                    onClick={() => handleBadgeClick(badgeId)}
                    className="text-gray-400 hover:text-white"
                  >
                    <FaTimes className="w-3 h-3" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Badges Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-white">
            {isSearching
              ? "Search Results"
              : selectedCategory === "all"
                ? "Popular Badges"
                : `${categories.find((c) => c.id === selectedCategory)?.label} Badges`}
          </h3>
          <span className="text-xs text-gray-500">
            {displayBadges.length} badge{displayBadges.length !== 1 ? "s" : ""}
          </span>
        </div>

        {displayBadges.length === 0 ? (
          <div className="text-center py-10 border border-gray-800 rounded-lg">
            <FaSearch className="w-8 h-8 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500">No badges found for "{searchQuery}"</p>
            <p className="text-sm text-gray-600 mt-1">
              Try a different search term
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            <AnimatePresence>
              {displayBadges.map((badge) => {
                const isSelected = badges.includes(badge.id);
                return (
                  <motion.button
                    key={badge.id}
                    layoutId={`badge-${badge.id}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleBadgeClick(badge.id)}
                    className={`relative p-4 rounded-lg border transition-all duration-200 flex flex-col items-center justify-center ${
                      isSelected
                        ? "bg-blue-900/20 border-blue-500 ring-2 ring-blue-500/20"
                        : "bg-gray-900 border-gray-800 hover:bg-gray-800 hover:border-gray-700"
                    }`}
                  >
                    {/* Badge Image Preview */}
                    <div className="mb-2">
                      <img
                        src={badge.url}
                        alt={badge.label}
                        className="h-6 w-auto"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.parentElement.innerHTML = `<div class="h-6 w-20 bg-gray-700 rounded"></div>`;
                        }}
                      />
                    </div>

                    {/* Badge Label */}
                    <span
                      className={`text-xs font-medium text-center ${
                        isSelected ? "text-blue-300" : "text-gray-300"
                      }`}
                    >
                      {badge.label}
                    </span>

                    {/* Category Tag */}
                    <span className="text-[10px] text-gray-500 mt-1">
                      {badge.category}
                    </span>

                    {/* Selection Indicator */}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 bg-blue-500 text-white p-1 rounded-full"
                      >
                        <FaCheck className="w-3 h-3" />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="text-sm text-gray-500 border-t border-gray-800 pt-4">
        <p className="flex items-start gap-2">
          <FaTag className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>
            Badges are generated using{" "}
            <a
              href="https://shields.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              Shields.io
            </a>
            . Click to select/deselect. Selected badges will appear in your
            README.
          </span>
        </p>
      </div>
    </motion.div>
  );
}
