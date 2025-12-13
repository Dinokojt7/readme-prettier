"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaCopy, FaCheck, FaPlus, FaTrash, FaTerminal } from "react-icons/fa";
import useAppStore from "@/lib/store-persist";

export default function InstallationStep() {
  const { installation, updateField } = useAppStore();
  const [installationType, setInstallationType] = useState("simple");
  const [copiedItem, setCopiedItem] = useState(null);

  // Templates
  const templates = {
    simple: {
      prerequisites: ["Node.js 18+ (LTS recommended)", "npm or yarn", "Git"],
      steps: [
        {
          title: "Clone repository",
          code: "git clone https://github.com/username/project.git\ncd project",
        },
        { title: "Install dependencies", code: "npm install" },
        { title: "Start development", code: "npm run dev" },
      ],
      scripts: [
        { command: "npm run dev", description: "Start dev server" },
        { command: "npm run build", description: "Build for production" },
      ],
    },
    detailed: {
      prerequisites: [
        "Node.js 18+",
        "npm 10+",
        "Git",
        "Code editor",
        "Firebase account",
      ],
      steps: [
        {
          title: "Clone the repository",
          code: "git clone https://github.com/username/project.git\ncd project",
        },
        { title: "Install dependencies", code: "npm install" },
        { title: "Setup environment", code: "cp .env.example .env.local" },
        { title: "Start server", code: "npm run dev" },
      ],
      scripts: [
        { command: "npm run dev", description: "Start dev server" },
        { command: "npm run build", description: "Build for production" },
        { command: "npm start", description: "Start production" },
        { command: "npm run lint", description: "Run linting" },
      ],
    },
  };

  // State
  const [customPrerequisites, setCustomPrerequisites] = useState(
    templates.simple.prerequisites,
  );
  const [customSteps, setCustomSteps] = useState(templates.simple.steps);
  const [customScripts, setCustomScripts] = useState(templates.simple.scripts);
  const [additionalNotes, setAdditionalNotes] = useState("");

  // Apply template
  useEffect(() => {
    if (installationType !== "custom") {
      const template = templates[installationType];
      setCustomPrerequisites([...template.prerequisites]);
      setCustomSteps([...template.steps]);
      setCustomScripts([...template.scripts]);
    }
  }, [installationType]);

  const handleCopy = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(id);
      setTimeout(() => setCopiedItem(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const addPrerequisite = () => {
    setCustomPrerequisites([...customPrerequisites, ""]);
  };

  const updatePrerequisite = (index, value) => {
    const updated = [...customPrerequisites];
    updated[index] = value;
    setCustomPrerequisites(updated);
  };

  const removePrerequisite = (index) => {
    setCustomPrerequisites(customPrerequisites.filter((_, i) => i !== index));
  };

  const addStep = () => {
    setCustomSteps([...customSteps, { title: "", code: "" }]);
  };

  const updateStep = (index, field, value) => {
    const updated = [...customSteps];
    updated[index][field] = value;
    setCustomSteps(updated);
  };

  const removeStep = (index) => {
    setCustomSteps(customSteps.filter((_, i) => i !== index));
  };

  const addScript = () => {
    setCustomScripts([...customScripts, { command: "", description: "" }]);
  };

  const updateScript = (index, field, value) => {
    const updated = [...customScripts];
    updated[index][field] = value;
    setCustomScripts(updated);
  };

  const removeScript = (index) => {
    setCustomScripts(customScripts.filter((_, i) => i !== index));
  };

  const generateMarkdown = () => {
    let content = "## 🚀 Getting Started\n\n";

    // Prerequisites
    const activePrereqs = customPrerequisites.filter((p) => p.trim());
    if (activePrereqs.length > 0) {
      content += "### Prerequisites\n\n";
      activePrereqs.forEach((item) => {
        content += `- ${item}\n`;
      });
      content += "\n";
    }

    // Installation Steps
    const activeSteps = customSteps.filter(
      (s) => s.title.trim() && s.code.trim(),
    );
    if (activeSteps.length > 0) {
      content += "### Installation\n\n";
      activeSteps.forEach((item, index) => {
        content += `${index + 1}. **${item.title}**\n\n`;
        content += "```bash\n";
        content += `${item.code}\n`;
        content += "```\n\n";
      });
    }

    // Available Scripts
    const activeScripts = customScripts.filter(
      (s) => s.command.trim() && s.description.trim(),
    );
    if (activeScripts.length > 0) {
      content += "### Available Scripts\n\n";
      content += "```bash\n";
      activeScripts.forEach((item) => {
        content += `${item.command.padEnd(20)} # ${item.description}\n`;
      });
      content += "```\n\n";
    }

    // Additional Notes
    if (additionalNotes.trim()) {
      content += "### Additional Notes\n\n";
      content += `${additionalNotes}\n\n`;
    }

    return content;
  };

  const handleSave = () => {
    const markdown = generateMarkdown();
    updateField("installation", markdown);
  };

  const handleReset = () => {
    setInstallationType("simple");
    setCustomPrerequisites(templates.simple.prerequisites);
    setCustomSteps(templates.simple.steps);
    setCustomScripts(templates.simple.scripts);
    setAdditionalNotes("");
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
          🚀 Installation
        </h2>
        <p className="text-gray-400 text-sm">
          Setup instructions for your project
        </p>
      </div>

      {/* Prerequisites */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-white">Prerequisites</h3>
          <button
            onClick={addPrerequisite}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg"
          >
            <FaPlus className="w-3 h-3" />
            Add
          </button>
        </div>

        <div className="space-y-2">
          {customPrerequisites.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-3 bg-gray-800/50 rounded-lg"
            >
              <input
                type="text"
                value={item}
                onChange={(e) => updatePrerequisite(index, e.target.value)}
                className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none"
                placeholder="e.g., Node.js 18+"
              />
              <button
                onClick={() => removePrerequisite(index)}
                className="p-1.5 text-gray-400 hover:text-red-400"
              >
                <FaTrash className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Installation Steps */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-white">Installation Steps</h3>
          <button
            onClick={addStep}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg"
          >
            <FaPlus className="w-3 h-3" />
            Add Step
          </button>
        </div>

        <div className="space-y-4">
          {customSteps.map((step, index) => (
            <div
              key={index}
              className="bg-gray-800/50 rounded-lg overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={step.title}
                      onChange={(e) =>
                        updateStep(index, "title", e.target.value)
                      }
                      placeholder="Step title"
                      className="w-full bg-transparent text-white font-medium placeholder-gray-500 focus:outline-none mb-2"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Code block</span>
                      <button
                        onClick={() => handleCopy(step.code, `step-${index}`)}
                        className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 text-gray-300 rounded"
                      >
                        {copiedItem === `step-${index}` ? (
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
                  </div>
                  <button
                    onClick={() => removeStep(index)}
                    className="p-1.5 text-gray-400 hover:text-red-400"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>

                <textarea
                  value={step.code}
                  onChange={(e) => updateStep(index, "code", e.target.value)}
                  placeholder="Bash commands..."
                  rows={3}
                  className="w-full font-mono text-sm bg-gray-900 text-gray-300 border border-gray-700 rounded-lg p-3 focus:outline-none resize-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Available Scripts */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-white">Available Scripts</h3>
          <button
            onClick={addScript}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg"
          >
            <FaPlus className="w-3 h-3" />
            Add Script
          </button>
        </div>

        <div className="space-y-3">
          {customScripts.map((script, index) => (
            <div key={index} className="bg-gray-800/50 rounded-lg p-3">
              <div className="flex items-start gap-3">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={script.command}
                        onChange={(e) =>
                          updateScript(index, "command", e.target.value)
                        }
                        placeholder="npm run dev"
                        className="w-full font-mono text-sm bg-transparent text-white placeholder-gray-500 focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={() =>
                        handleCopy(script.command, `script-${index}`)
                      }
                      className="flex items-center gap-2 px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded"
                    >
                      {copiedItem === `script-${index}` ? (
                        <FaCheck className="w-3 h-3" />
                      ) : (
                        <FaCopy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={script.description}
                    onChange={(e) =>
                      updateScript(index, "description", e.target.value)
                    }
                    placeholder="Command description"
                    className="w-full text-sm bg-transparent text-gray-400 placeholder-gray-600 focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => removeScript(index)}
                  className="p-1.5 text-gray-400 hover:text-red-400"
                >
                  <FaTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Notes */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-white">Additional Notes</h3>
        <textarea
          value={additionalNotes}
          onChange={(e) => setAdditionalNotes(e.target.value)}
          placeholder="Troubleshooting tips, special instructions..."
          rows={4}
          className="w-full bg-gray-800/50 text-white placeholder-gray-500 border border-gray-700 rounded-lg p-3 focus:outline-none resize-none"
        />
      </div>

      {/* Preview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-white">Preview</h3>
          <button
            onClick={() => handleCopy(generateMarkdown(), "full")}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg"
          >
            {copiedItem === "full" ? (
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

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
            {generateMarkdown()}
          </pre>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-800">
        <button
          onClick={handleReset}
          className="px-4 py-2 border border-gray-700 hover:border-gray-600 text-gray-300 rounded-lg font-medium transition-colors"
        >
          Reset
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          Save
        </button>
      </div>
    </motion.div>
  );
}
