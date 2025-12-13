"use client";

import { motion } from "framer-motion";
import { FaUser, FaGithub, FaHeart, FaLink } from "react-icons/fa";
import useAppStore from "@/lib/store-persist";

export default function AuthorStep() {
  const { author, updateAuthor } = useAppStore();

  const validateGitHubProfile = async (username) => {
    if (!username) return false;
    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  const handleGitHubChange = async (e) => {
    const username = e.target.value;
    updateAuthor("link", username ? `https://github.com/${username}` : "");
    updateAuthor("name", username);
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
          Author & Attribution
        </h2>
        <p className="text-gray-400 text-sm">
          Add author information and attribution to your README.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Author Name
          </label>
          <div className="relative">
            <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="text"
              value={author.name}
              onChange={(e) => updateAuthor("name", e.target.value)}
              placeholder="Your Name"
              className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            GitHub Username
          </label>
          <div className="relative">
            <FaGithub className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="text"
              value={author.name}
              onChange={handleGitHubChange}
              placeholder="username"
              className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Your GitHub profile link will be generated automatically
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Custom Link (Optional)
          </label>
          <div className="relative">
            <FaLink className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="url"
              value={author.link.includes("github.com") ? "" : author.link}
              onChange={(e) => updateAuthor("link", e.target.value)}
              placeholder="https://yourwebsite.com"
              className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={author.name && author.link.includes("github.com")}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Leave blank to use GitHub profile
          </p>
        </div>

        {/* Preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 pt-6 border-t border-gray-800"
        >
          <p className="text-sm text-gray-400 mb-2">Preview:</p>
          <div className="p-4 bg-gray-900 rounded-lg border border-gray-800">
            <div className="text-center">
              <p className="text-gray-300">
                Made with{" "}
                <FaHeart className="inline-block w-4 h-4 text-red-400 mx-1" />{" "}
                by{" "}
                {author.name ? (
                  <a
                    href={author.link || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    {author.name}
                  </a>
                ) : (
                  <span className="text-gray-500">Your Name</span>
                )}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="text-sm text-gray-500 pt-4 border-t border-gray-800">
        <p>
          💡 This section will appear at the bottom of your README with
          attribution. GitHub usernames are automatically validated.
        </p>
      </div>
    </motion.div>
  );
}
