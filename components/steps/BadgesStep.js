"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaTimes,
  FaCheck,
  FaTag,
  FaFilter,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import useAppStore, { badgeConfig, searchBadges } from "@/lib/store-persist";

const categories = [
  { id: "all", label: "All Categories" },
  { id: "framework", label: "Frameworks" },
  { id: "styling", label: "Styling" },
  { id: "backend", label: "Backend" },
  { id: "database", label: "Databases" },
  { id: "language", label: "Languages" },
  { id: "tool", label: "Tools" },
  { id: "deployment", label: "Deployment" },
  { id: "license", label: "License" },
  { id: "status", label: "Status" },
];

export default function BadgesStep() {
  const { badges, addBadge } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const categoryDropdownRef = useRef(null);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target)
      ) {
        setShowCategoryDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Enhanced search with priority: name > message > category
  useEffect(() => {
    if (searchQuery.trim()) {
      setIsSearching(true);

      // Get all badges for filtering
      const allBadges = Object.entries(badgeConfig).map(([id, badge]) => ({
        id,
        ...badge,
      }));

      const searchTerm = searchQuery.toLowerCase();

      // Priority 1: Exact name matches
      const nameMatches = allBadges.filter((badge) =>
        badge.label.toLowerCase().includes(searchTerm),
      );

      // Priority 2: Message matches (like "Cloud" in Firebase)
      const messageMatches = allBadges
        .filter(
          (badge) =>
            badge.message && badge.message.toLowerCase().includes(searchTerm),
        )
        .filter((badge) => !nameMatches.find((n) => n.id === badge.id));

      // Priority 3: Category matches
      const categoryMatches = allBadges
        .filter((badge) => badge.category.toLowerCase().includes(searchTerm))
        .filter(
          (badge) =>
            !nameMatches.find((n) => n.id === badge.id) &&
            !messageMatches.find((m) => m.id === badge.id),
        );

      // Combine with priority order
      const results = [...nameMatches, ...messageMatches, ...categoryMatches];
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
  const selectedCategoryLabel = categories.find(
    (c) => c.id === selectedCategory,
  )?.label;

  const handleBadgeClick = (badgeId) => {
    addBadge(badgeId);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">
          Select Badges
        </h2>
        <p className="text-gray-400 text-sm">
          Choose badges to showcase your tech stack. Search or filter by
          category.
        </p>
      </div>

      {/* Search and Filter Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search badges (e.g., Firebase, Next.js, MIT)..."
            className="w-full pl-10 pr-8 py-2.5 text-sm bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

        {/* Category Dropdown */}
        <div className="relative" ref={categoryDropdownRef}>
          <button
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            className="flex items-center justify-between gap-2 px-4 py-2.5 text-sm bg-gray-900 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors w-full sm:w-48"
          >
            <span className="truncate">{selectedCategoryLabel}</span>
            {showCategoryDropdown ? (
              <FaChevronUp className="w-3.5 h-3.5 flex-shrink-0" />
            ) : (
              <FaChevronDown className="w-3.5 h-3.5 flex-shrink-0" />
            )}
          </button>

          <AnimatePresence>
            {showCategoryDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-50 mt-1 w-full bg-gray-900 border border-gray-700 rounded-lg shadow-2xl overflow-hidden"
              >
                <div className="max-h-60 overflow-y-auto py-1">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setShowCategoryDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        selectedCategory === category.id
                          ? "bg-blue-600 text-white"
                          : "text-gray-300 hover:bg-gray-800"
                      }`}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Search Results Count */}
      <AnimatePresence>
        {isSearching && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-sm text-gray-500"
          >
            Found {searchResults.length} badge
            {searchResults.length !== 1 ? "s" : ""}
            {searchQuery && (
              <span className="ml-2 text-gray-600">
                • Priority: Name → Message → Category
              </span>
            )}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Selected Badges Preview */}
      {badges.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
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

      {/* Badges Grid - 3 per row */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-white">
            {isSearching
              ? "Search Results"
              : selectedCategory === "all"
                ? "Popular Badges"
                : `${selectedCategoryLabel}`}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {displayBadges.map((badge) => {
                const isSelected = badges.includes(badge.id);
                return (
                  <motion.button
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={() => handleBadgeClick(badge.id)}
                    className={`relative p-4 rounded-lg border transition-all duration-150 flex flex-col items-center ${
                      isSelected
                        ? "bg-blue-900/20 border-blue-500 ring-1 ring-blue-500/30"
                        : "bg-gray-900 border-gray-800 hover:bg-gray-800 hover:border-gray-700"
                    }`}
                  >
                    {/* Badge Image with message */}
                    <div className="mb-2">
                      <img
                        src={badge.url}
                        alt={badge.label}
                        className="h-4 w-auto"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.parentElement.innerHTML = `<div class="h-4 flex items-center justify-center">
                            <span class="text-sm text-gray-400">${badge.label}</span>
                          </div>`;
                        }}
                      />
                    </div>

                    {/* Badge Label & Message */}
                    <div className="text-center">
                      <span
                        className={`text-xs font-medium ${
                          isSelected ? "text-blue-300" : "text-gray-300"
                        }`}
                      >
                        {badge.label}
                      </span>
                      {badge.message && (
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {badge.message}
                        </p>
                      )}
                    </div>

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
                        <FaCheck className="w-2.5 h-2.5" />
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
