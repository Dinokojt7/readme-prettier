"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  FaUser,
  FaGithub,
  FaHeart,
  FaLink,
  FaGlobe,
  FaCheck,
  FaTimes,
  FaCopy,
  FaTwitter,
  FaLinkedin,
  FaArrowLeft,
} from "react-icons/fa";
import useAppStore from "@/lib/store-persist";

export default function AuthorStep() {
  const { author, updateAuthor } = useAppStore();
  const [formData, setFormData] = useState({
    name: author.name || "",
    githubUsername: author.link?.includes("github.com/")
      ? author.link.split("github.com/")[1]
      : "",
    customLink:
      author.link && !author.link.includes("github.com/") ? author.link : "",
    profileType: author.link?.includes("github.com/")
      ? "github"
      : author.link
        ? "custom"
        : "none",
  });
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [copiedItem, setCopiedItem] = useState(null);
  const validationTimeoutRef = useRef(null);
  const nameInputRef = useRef(null);

  // Sync with store on mount
  useEffect(() => {
    if (author.name) {
      setFormData((prev) => ({
        ...prev,
        name: author.name,
      }));
    }
    // Focus name input on mount
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, []);

  // GitHub username validation
  const validateGitHubUsername = async (username) => {
    if (!username) {
      setValidationResult(null);
      return;
    }

    setIsValidating(true);
    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      if (response.ok) {
        setValidationResult({ valid: true, message: "Valid GitHub username" });
      } else {
        setValidationResult({ valid: false, message: "GitHub user not found" });
      }
    } catch (error) {
      setValidationResult({ valid: false, message: "Network error" });
    } finally {
      setIsValidating(false);
    }
  };

  // Debounced validation
  useEffect(() => {
    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
    }

    if (formData.githubUsername && formData.profileType === "github") {
      validationTimeoutRef.current = setTimeout(() => {
        validateGitHubUsername(formData.githubUsername);
      }, 500);
    } else {
      setValidationResult(null);
    }

    return () => {
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current);
      }
    };
  }, [formData.githubUsername, formData.profileType]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleProfileTypeChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      profileType: type,
      customLink: type === "github" ? "" : prev.customLink,
      githubUsername: type === "custom" ? "" : prev.githubUsername,
    }));
    setValidationResult(null);
  };

  const generateAuthorLink = () => {
    if (formData.profileType === "github" && formData.githubUsername) {
      return `https://github.com/${formData.githubUsername}`;
    } else if (formData.profileType === "custom" && formData.customLink) {
      // Ensure URL has protocol
      const url = formData.customLink.trim();
      return url.startsWith("http") ? url : `https://${url}`;
    }
    return "";
  };

  const handleCopy = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(id);
      setTimeout(() => setCopiedItem(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleSave = () => {
    const link = generateAuthorLink();
    updateAuthor("name", formData.name.trim());
    updateAuthor("link", link);
  };

  const handleReset = () => {
    setFormData({
      name: "",
      githubUsername: "",
      customLink: "",
      profileType: "github",
    });
    setValidationResult(null);
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  };

  const getPreviewMarkdown = () => {
    const link = generateAuthorLink();
    const name = formData.name.trim();

    if (!name) {
      return "Made with ❤️ by [Your Name](#)";
    }

    if (link) {
      return `Made with ❤️ by <a href="${link}">${name}</a>`;
    }

    return `Made with ❤️ by ${name}`;
  };

  const getFullMarkdown = () => {
    const link = generateAuthorLink();
    const name = formData.name.trim();

    if (!name) return "";

    let content = "---\n\n";
    content += '<p align="center">\n';
    content += `  Made with ❤️ by `;

    if (link) {
      content += `<a href="${link}">${name}</a>\n`;
    } else {
      content += `${name}\n`;
    }

    content += "</p>\n\n";
    content += "---\n\n";
    content +=
      "*README generated with [readmepolished](https://readmepolished.vercel.app)*\n";

    return content;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">
          👤 Author Info
        </h2>
        <p className="text-gray-400 text-sm">
          Add author attribution to your README
        </p>
      </div>

      {/* Author Name - Fixed width */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-white">Author Name</h3>
        <div className="relative w-full max-w-2xl">
          <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input
            ref={nameInputRef}
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Your full name or username"
            className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 truncate"
            maxLength={50}
          />
        </div>
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>Display name for attribution</span>
          <span>{formData.name.length}/50</span>
        </div>
      </div>

      {/* Profile Type Selection - Fixed width buttons */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-white">Profile Link</h3>
        <div className="flex flex-wrap gap-2 max-w-2xl">
          <button
            onClick={() => handleProfileTypeChange("github")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors flex-shrink-0 ${
              formData.profileType === "github"
                ? "bg-gray-800 text-white border border-gray-700"
                : "bg-gray-900 text-gray-300 hover:bg-gray-800 border border-gray-800"
            }`}
          >
            <FaGithub className="w-4 h-4 flex-shrink-0" />
            <span>GitHub</span>
          </button>
          <button
            onClick={() => handleProfileTypeChange("custom")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors flex-shrink-0 ${
              formData.profileType === "custom"
                ? "bg-gray-800 text-white border border-gray-700"
                : "bg-gray-900 text-gray-300 hover:bg-gray-800 border border-gray-800"
            }`}
          >
            <FaLink className="w-4 h-4 flex-shrink-0" />
            <span>Custom URL</span>
          </button>
          <button
            onClick={() => handleProfileTypeChange("none")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors flex-shrink-0 ${
              formData.profileType === "none"
                ? "bg-gray-800 text-white border border-gray-700"
                : "bg-gray-900 text-gray-300 hover:bg-gray-800 border border-gray-800"
            }`}
          >
            <FaTimes className="w-4 h-4 flex-shrink-0" />
            <span>No Link</span>
          </button>
        </div>
      </div>

      {/* GitHub Username Input - Fixed width */}
      {formData.profileType === "github" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-300">
              GitHub Username
            </label>
            {validationResult && (
              <span
                className={`text-xs ${validationResult.valid ? "text-green-400" : "text-red-400"}`}
              >
                {validationResult.valid ? "✓ " : "✗ "}
                {validationResult.message}
              </span>
            )}
          </div>
          <div className="relative w-full max-w-2xl">
            <FaGithub className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="text"
              value={formData.githubUsername}
              onChange={(e) =>
                handleInputChange(
                  "githubUsername",
                  e.target.value.replace(/[^a-zA-Z0-9-]/g, ""),
                )
              }
              placeholder="username"
              className="w-full pl-12 pr-12 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 truncate"
              maxLength={39}
            />
            {isValidating ? (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-transparent"></div>
              </div>
            ) : (
              formData.githubUsername && (
                <button
                  onClick={() =>
                    handleCopy(
                      `https://github.com/${formData.githubUsername}`,
                      "gh-link",
                    )
                  }
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  title="Copy GitHub URL"
                >
                  {copiedItem === "gh-link" ? (
                    <FaCheck className="w-4 h-4" />
                  ) : (
                    <FaCopy className="w-4 h-4" />
                  )}
                </button>
              )
            )}
          </div>
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>
              Will generate: github.com/{formData.githubUsername || "username"}
            </span>
            <span>{formData.githubUsername.length}/39</span>
          </div>
        </div>
      )}

      {/* Custom Link Input - Fixed width */}
      {formData.profileType === "custom" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-300">
              Custom URL
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Include https://</span>
            </div>
          </div>
          <div className="relative w-full max-w-2xl">
            <FaGlobe className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="text"
              value={formData.customLink}
              onChange={(e) => handleInputChange("customLink", e.target.value)}
              placeholder="yourwebsite.com or twitter.com/username"
              className="w-full pl-12 pr-12 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 truncate"
              maxLength={100}
            />
            {formData.customLink && (
              <button
                onClick={() =>
                  handleCopy(
                    formData.customLink.startsWith("http")
                      ? formData.customLink
                      : `https://${formData.customLink}`,
                    "custom-link",
                  )
                }
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                title="Copy URL"
              >
                {copiedItem === "custom-link" ? (
                  <FaCheck className="w-4 h-4" />
                ) : (
                  <FaCopy className="w-4 h-4" />
                )}
              </button>
            )}
          </div>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <FaTwitter className="w-4 h-4" />
              <span>Twitter</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <FaLinkedin className="w-4 h-4" />
              <span>LinkedIn</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <FaGlobe className="w-4 h-4" />
              <span>Website</span>
            </div>
          </div>
        </div>
      )}

      {/* Generated Link Preview - Fixed width container */}
      {(formData.githubUsername || formData.customLink) &&
        formData.profileType !== "none" && (
          <div className="bg-gray-800/50 rounded-lg p-4 max-w-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Generated Link:</span>
              <button
                onClick={() => handleCopy(generateAuthorLink(), "link")}
                className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 text-gray-300 rounded flex-shrink-0"
              >
                {copiedItem === "link" ? (
                  <>
                    <FaCheck className="w-3 h-3" />
                    Copied
                  </>
                ) : (
                  <>
                    <FaCopy className="w-3 h-3" />
                    Copy
                  </>
                )}
              </button>
            </div>
            <code className="text-sm text-blue-300 break-all font-mono block">
              {generateAuthorLink()}
            </code>
          </div>
        )}

      {/* Generated Preview - Fixed width */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-white">Preview</h3>
          <button
            onClick={() => handleCopy(getFullMarkdown(), "preview")}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg flex-shrink-0"
          >
            {copiedItem === "preview" ? (
              <>
                <FaCheck className="w-3 h-3" />
                Copied
              </>
            ) : (
              <>
                <FaCopy className="w-3 h-3" />
                Copy
              </>
            )}
          </button>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 max-w-2xl">
          <div className="text-center">
            <p
              className="text-gray-300"
              dangerouslySetInnerHTML={{ __html: getPreviewMarkdown() }}
            />
          </div>
        </div>

        {/* Full Markdown Preview - Fixed width with scroll */}
        {getFullMarkdown() && (
          <div className="mt-4">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 overflow-x-auto max-w-2xl">
              <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono min-w-0">
                {getFullMarkdown()}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Stats - Fixed width */}
      <div className="flex items-center justify-between text-sm max-w-2xl">
        <div className="text-gray-400">
          {formData.name.trim() ? "✓ Name set" : "✗ No name"}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {formData.profileType === "github" && formData.githubUsername && (
              <>
                <FaGithub className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400">GitHub</span>
              </>
            )}
            {formData.profileType === "custom" && formData.customLink && (
              <>
                <FaGlobe className="w-4 h-4 text-blue-400" />
                <span className="text-gray-400">Custom URL</span>
              </>
            )}
            {formData.profileType === "none" && (
              <span className="text-gray-400">No link</span>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons - Fixed width container */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-800 max-w-2xl">
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 border border-gray-700 hover:border-gray-600 text-gray-300 rounded-lg font-medium transition-colors"
        >
          <FaArrowLeft className="w-4 h-4" />
          Reset
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          Save
        </button>
      </div>

      {/* Help Text - Fixed width */}
      <div className="text-sm text-gray-500 space-y-2 max-w-2xl">
        <div className="flex items-start gap-2">
          <FaHeart className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-400" />
          <div>
            <p className="font-medium text-gray-400">Tips:</p>
            <ul className="list-disc list-inside space-y-1 mt-1 ml-2">
              <li>GitHub usernames are auto-validated as you type</li>
              <li>
                Use "Custom URL" for Twitter, LinkedIn, or personal websites
              </li>
              <li>Choose "No Link" if you don't want a clickable name</li>
              <li>Save to update the author section in your README</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
