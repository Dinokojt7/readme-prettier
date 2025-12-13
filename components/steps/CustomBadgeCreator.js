"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaPlus, FaTimes, FaCopy, FaCheck } from "react-icons/fa";
import useAppStore from "@/lib/store";

const CustomBadgeCreator = () => {
  const [label, setLabel] = useState("");
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("blue");
  const [logo, setLogo] = useState("");
  const [logoColor, setLogoColor] = useState("white");
  const [link, setLink] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const colorOptions = [
    { value: "blue", label: "Blue", class: "bg-blue-500" },
    { value: "green", label: "Green", class: "bg-green-500" },
    { value: "red", label: "Red", class: "bg-red-500" },
    { value: "yellow", label: "Yellow", class: "bg-yellow-500" },
    { value: "purple", label: "Purple", class: "bg-purple-500" },
    { value: "pink", label: "Pink", class: "bg-pink-500" },
    { value: "orange", label: "Orange", class: "bg-orange-500" },
    { value: "gray", label: "Gray", class: "bg-gray-500" },
  ];

  const logoOptions = [
    { value: "", label: "None" },
    { value: "github", label: "GitHub" },
    { value: "npm", label: "npm" },
    { value: "docker", label: "Docker" },
    { value: "react", label: "React" },
    { value: "node.js", label: "Node.js" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "aws", label: "AWS" },
  ];

  const generateBadgeUrl = () => {
    if (!label.trim() || !message.trim()) return;

    let url = `https://img.shields.io/badge/${encodeURIComponent(label)}-${encodeURIComponent(message)}-${color}`;

    if (logo) {
      url += `?logo=${logo}`;
      if (logoColor && logoColor !== "white") {
        url += `&logoColor=${logoColor}`;
      }
    }

    setGeneratedUrl(url);
    setCopied(false);
  };

  const copyToClipboard = () => {
    if (!generatedUrl) return;

    const markdown = `[![${label} ${message}](${generatedUrl})](${link || "#"})`;

    navigator.clipboard.writeText(markdown).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const addToSelected = () => {
    if (!generatedUrl || !label) return;

    // Generate a unique ID for custom badge
    const badgeId = `custom_${Date.now()}`;

    // We would need to update the store to handle custom badges
    console.log("Custom badge created:", {
      id: badgeId,
      label,
      url: generatedUrl,
      link,
    });

    // Reset form
    setLabel("");
    setMessage("");
    setColor("blue");
    setLogo("");
    setLogoColor("white");
    setLink("");
    setGeneratedUrl("");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 border border-gray-800 rounded-xl p-5 bg-gray-900/50"
    >
      <h3 className="text-lg font-semibold text-white mb-2">
        <FaPlus className="inline-block w-4 h-4 mr-2" />
        Create Custom Badge
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column: Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Label
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g., Firebase"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Message
            </label>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g., Cloud"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Color
            </label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setColor(option.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                    color === option.value
                      ? "ring-2 ring-blue-400"
                      : "opacity-80 hover:opacity-100"
                  } ${option.class}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Logo
              </label>
              <select
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {logoOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Logo Color
              </label>
              <input
                type="color"
                value={`#${logoColor === "white" ? "ffffff" : logoColor}`}
                onChange={(e) => setLogoColor(e.target.value.replace("#", ""))}
                className="w-full h-10 bg-gray-800 border border-gray-700 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Link URL (Optional)
            </label>
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={generateBadgeUrl}
            disabled={!label.trim() || !message.trim()}
            className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Generate Badge
          </button>
        </div>

        {/* Right Column: Preview & Actions */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Preview
            </label>
            <div className="p-4 bg-gray-900 rounded-lg border border-gray-800 min-h-[120px] flex items-center justify-center">
              {generatedUrl ? (
                <div className="text-center">
                  <img
                    src={generatedUrl}
                    alt={`${label} ${message}`}
                    className="inline-block h-8"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.parentElement.innerHTML =
                        '<div class="text-red-400 text-sm">Invalid badge configuration</div>';
                    }}
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    {link ? "Clickable badge" : "Static badge"}
                  </p>
                </div>
              ) : (
                <div className="text-gray-500 text-center">
                  <p>Configure your badge to see a preview</p>
                </div>
              )}
            </div>
          </div>

          {generatedUrl && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Generated URL
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={generatedUrl}
                    readOnly
                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 text-sm truncate"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="px-3 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    {copied ? (
                      <FaCheck className="w-4 h-4" />
                    ) : (
                      <FaCopy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Markdown Code
                </label>
                <div className="p-3 bg-gray-950 rounded-lg border border-gray-800">
                  <code className="text-sm text-gray-300 font-mono break-all">
                    [![{label} {message}]({generatedUrl})]({link || "#"})
                  </code>
                </div>
              </div>

              <button
                onClick={addToSelected}
                className="w-full py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <FaPlus className="w-4 h-4" />
                Add to Selected Badges
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="text-xs text-gray-500 pt-3 border-t border-gray-800">
        <p>
          💡 Custom badges are powered by{" "}
          <a
            href="https://shields.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            Shields.io
          </a>
          . You can create badges for any service, technology, or status.
        </p>
      </div>
    </motion.div>
  );
};

export default CustomBadgeCreator;
