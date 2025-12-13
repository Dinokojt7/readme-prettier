"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  FaPlus,
  FaTrash,
  FaCopy,
  FaCheck,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaKey,
  FaCode,
  FaQuestionCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import useAppStore from "@/lib/store-persist";

export default function EnvironmentStep() {
  const { environmentVariables, updateField } = useAppStore();
  const [envVars, setEnvVars] = useState([
    {
      id: 1,
      name: "NEXT_PUBLIC_API_URL",
      value: "https://api.example.com",
      placeholder: "https://your-api.com",
      isSecret: false,
      showValue: true,
    },
  ]);
  const [template, setTemplate] = useState("custom");
  const [copiedVar, setCopiedVar] = useState(null);
  const [showBulkEditor, setShowBulkEditor] = useState(false);
  const [bulkContent, setBulkContent] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const lastAddedRef = useRef(null);

  // Common environment templates
  const templates = {
    nextjs: [
      {
        name: "NEXT_PUBLIC_API_URL",
        value: "",
        placeholder: "https://api.example.com",
        isSecret: false,
      },
      {
        name: "NEXT_PUBLIC_APP_URL",
        value: "",
        placeholder: "https://app.example.com",
        isSecret: false,
      },
      {
        name: "DATABASE_URL",
        value: "",
        placeholder: "postgresql://...",
        isSecret: true,
      },
      {
        name: "NEXTAUTH_SECRET",
        value: "",
        placeholder: "generate with: openssl rand -base64 32",
        isSecret: true,
      },
      {
        name: "NEXTAUTH_URL",
        value: "",
        placeholder: "https://app.example.com",
        isSecret: false,
      },
    ],
    node: [
      { name: "PORT", value: "3000", placeholder: "3000", isSecret: false },
      {
        name: "NODE_ENV",
        value: "development",
        placeholder: "development | production",
        isSecret: false,
      },
      {
        name: "DATABASE_URL",
        value: "",
        placeholder: "postgresql://...",
        isSecret: true,
      },
      {
        name: "JWT_SECRET",
        value: "",
        placeholder: "your-jwt-secret-here",
        isSecret: true,
      },
      {
        name: "API_KEY",
        value: "",
        placeholder: "your-api-key",
        isSecret: true,
      },
    ],
    react: [
      {
        name: "REACT_APP_API_URL",
        value: "",
        placeholder: "https://api.example.com",
        isSecret: false,
      },
      {
        name: "REACT_APP_FIREBASE_API_KEY",
        value: "",
        placeholder: "your-firebase-api-key",
        isSecret: true,
      },
      {
        name: "REACT_APP_GA_TRACKING_ID",
        value: "",
        placeholder: "UA-XXXXX-Y",
        isSecret: false,
      },
    ],
    firebase: [
      {
        name: "FIREBASE_API_KEY",
        value: "",
        placeholder: "your-api-key",
        isSecret: true,
      },
      {
        name: "FIREBASE_AUTH_DOMAIN",
        value: "",
        placeholder: "your-project.firebaseapp.com",
        isSecret: false,
      },
      {
        name: "FIREBASE_PROJECT_ID",
        value: "",
        placeholder: "your-project-id",
        isSecret: false,
      },
      {
        name: "FIREBASE_STORAGE_BUCKET",
        value: "",
        placeholder: "your-project.appspot.com",
        isSecret: false,
      },
    ],
    custom: [],
  };

  // Initialize with store data or default
  useEffect(() => {
    if (environmentVariables && environmentVariables.length > 0) {
      setEnvVars(
        environmentVariables.map((item, index) => ({
          ...item,
          id: index + 1,
          showValue: !item.isSecret,
        })),
      );
    }
  }, [environmentVariables]);

  // Focus new input when added
  useEffect(() => {
    if (lastAddedRef.current) {
      lastAddedRef.current.focus();
      lastAddedRef.current = null;
    }
  }, [envVars]);

  // Validate environment variable name
  const validateName = (name) => {
    const errors = [];

    if (!name.trim()) {
      return ["Name is required"];
    }

    if (!/^[A-Z_][A-Z0-9_]*$/.test(name)) {
      errors.push("Must be uppercase with underscores");
    }

    if (name.length > 50) {
      errors.push("Max 50 characters");
    }

    // Check for duplicates
    const duplicateCount = envVars.filter((v) => v.name === name).length;
    if (duplicateCount > 1) {
      errors.push("Duplicate variable name");
    }

    return errors;
  };

  const addVariable = () => {
    const newId = Math.max(0, ...envVars.map((v) => v.id)) + 1;
    const newVar = {
      id: newId,
      name: "",
      value: "",
      placeholder: "your-value-here",
      isSecret: false,
      showValue: true,
    };

    const updated = [...envVars, newVar];
    setEnvVars(updated);
    lastAddedRef.current = `name-${newId}`;

    // Clear validation for new row
    setValidationErrors((prev) => ({
      ...prev,
      [newId]: [],
    }));
  };

  const updateVariable = (id, field, value) => {
    const updated = envVars.map((v) =>
      v.id === id ? { ...v, [field]: value } : v,
    );

    setEnvVars(updated);

    // Validate on change
    if (field === "name") {
      const errors = validateName(value);
      setValidationErrors((prev) => ({
        ...prev,
        [id]: errors,
      }));
    }
  };

  const removeVariable = (id) => {
    const updated = envVars.filter((v) => v.id !== id);
    setEnvVars(updated);

    // Remove validation errors for removed item
    setValidationErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[id];
      return newErrors;
    });
  };

  const toggleSecret = (id) => {
    const updated = envVars.map((v) =>
      v.id === id ? { ...v, isSecret: !v.isSecret, showValue: !v.isSecret } : v,
    );
    setEnvVars(updated);
  };

  const toggleShowValue = (id) => {
    const updated = envVars.map((v) =>
      v.id === id ? { ...v, showValue: !v.showValue } : v,
    );
    setEnvVars(updated);
  };

  const handleCopy = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedVar(id);
      setTimeout(() => setCopiedVar(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const applyTemplate = (templateName) => {
    setTemplate(templateName);

    if (templateName === "custom") {
      setEnvVars([
        {
          id: 1,
          name: "",
          value: "",
          placeholder: "",
          isSecret: false,
          showValue: true,
        },
      ]);
      return;
    }

    const templateVars = templates[templateName].map((item, index) => ({
      ...item,
      id: index + 1,
      showValue: !item.isSecret,
    }));

    setEnvVars(templateVars);
    setValidationErrors({});
  };

  const handleBulkEditor = () => {
    if (showBulkEditor) {
      // Parse bulk content back to variables
      const lines = bulkContent.split("\n").filter((line) => line.trim());
      const newVars = [];

      lines.forEach((line, index) => {
        const [name, ...valueParts] = line.split("=");
        if (name && valueParts.length > 0) {
          const value = valueParts.join("=");
          newVars.push({
            id: index + 1,
            name: name.trim(),
            value: value.trim(),
            placeholder: "",
            isSecret:
              value.includes("secret") ||
              value.includes("key") ||
              value.includes("password"),
            showValue: true,
          });
        }
      });

      if (newVars.length > 0) {
        setEnvVars(newVars);
        setTemplate("custom");
      }
    } else {
      // Convert current vars to bulk format
      const content = envVars
        .filter((v) => v.name.trim() && v.value.trim())
        .map((v) => `${v.name}=${v.value}`)
        .join("\n");
      setBulkContent(content);
    }

    setShowBulkEditor(!showBulkEditor);
  };

  const generateMarkdown = () => {
    const activeVars = envVars.filter((v) => v.name.trim() && v.value.trim());

    if (activeVars.length === 0) {
      return "";
    }

    let content = "### Environment Variables\n\n";
    content +=
      "Create a `.env.local` file in the root directory and add the following variables:\n\n";
    content += "```bash\n";

    activeVars.forEach((v) => {
      const value = v.isSecret
        ? `your_${v.name.toLowerCase().replace(/_/g, "_")}_here`
        : v.value;
      content += `${v.name}=${value}\n`;
    });

    content += "```\n\n";

    // Add explanation for secret variables
    const hasSecrets = activeVars.some((v) => v.isSecret);
    if (hasSecrets) {
      content +=
        "**Note**: Variables marked with 🔒 are secret. Replace placeholder values with your actual secrets.\n\n";
    }

    return content;
  };

  const handleSave = () => {
    // Validate all before saving
    const errors = {};
    let hasErrors = false;

    envVars.forEach((v) => {
      if (v.name.trim()) {
        const nameErrors = validateName(v.name);
        if (nameErrors.length > 0) {
          errors[v.id] = nameErrors;
          hasErrors = true;
        }
      }
    });

    setValidationErrors(errors);

    if (hasErrors) {
      return;
    }

    const filteredVars = envVars
      .filter((v) => v.name.trim())
      .map(({ id, showValue, ...rest }) => rest);

    updateField("environmentVariables", filteredVars);
  };

  const handleReset = () => {
    setEnvVars([
      {
        id: 1,
        name: "",
        value: "",
        placeholder: "",
        isSecret: false,
        showValue: true,
      },
    ]);
    setTemplate("custom");
    setValidationErrors({});
    setShowBulkEditor(false);
  };

  const isVariableValid = (id) => {
    const varData = envVars.find((v) => v.id === id);
    return varData?.name.trim() && varData?.value.trim();
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
          🔐 Environment Variables
        </h2>
        <p className="text-gray-400 text-sm">
          Configure environment variables for your project
        </p>
      </div>

      {/* Template Selection */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-white">Quick Templates</h3>
        <div className="flex flex-wrap gap-2">
          {Object.keys(templates).map((tpl) => (
            <button
              key={tpl}
              onClick={() => applyTemplate(tpl)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                template === tpl
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {tpl === "custom"
                ? "Custom"
                : tpl === "nextjs"
                  ? "Next.js"
                  : tpl.charAt(0).toUpperCase() + tpl.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk Editor Toggle */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-white">Variables</h3>
        <button
          onClick={handleBulkEditor}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg"
        >
          <FaCode className="w-3 h-3" />
          {showBulkEditor ? "Form Editor" : "Bulk Editor"}
        </button>
      </div>

      {/* Bulk Editor */}
      {showBulkEditor ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <FaCode className="w-4 h-4" />
              <span>Edit variables in .env format</span>
            </div>
            <button
              onClick={() => handleCopy(bulkContent, "bulk")}
              className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 text-gray-300 rounded"
            >
              {copiedVar === "bulk" ? (
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

          <textarea
            value={bulkContent}
            onChange={(e) => setBulkContent(e.target.value)}
            placeholder="NEXT_PUBLIC_API_URL=https://api.example.com&#10;DATABASE_URL=postgresql://...&#10;API_KEY=your-secret-key"
            rows={8}
            className="w-full font-mono text-sm bg-gray-900 text-gray-300 border border-gray-700 rounded-lg p-3 focus:outline-none resize-none"
          />

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FaQuestionCircle className="w-4 h-4" />
            <span>Format: VARIABLE_NAME=value (one per line)</span>
          </div>
        </div>
      ) : (
        <>
          {/* Variables List */}
          <div className="space-y-4">
            {envVars.map((variable) => (
              <div key={variable.id} className="bg-gray-800/50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* Name Input */}
                  <div className="md:col-span-5">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-sm text-gray-400">Name</label>
                      {validationErrors[variable.id]?.length > 0 && (
                        <FaExclamationTriangle className="w-3 h-3 text-yellow-500" />
                      )}
                    </div>
                    <input
                      ref={
                        lastAddedRef === `name-${variable.id}`
                          ? (el) => {
                              if (el) el.focus();
                            }
                          : null
                      }
                      type="text"
                      value={variable.name}
                      onChange={(e) =>
                        updateVariable(variable.id, "name", e.target.value)
                      }
                      placeholder="e.g., DATABASE_URL"
                      className={`w-full font-mono text-sm bg-gray-900 border ${
                        validationErrors[variable.id]?.length > 0
                          ? "border-yellow-500"
                          : "border-gray-700"
                      } text-white rounded-lg p-2.5 focus:outline-none focus:border-blue-500`}
                    />
                    {validationErrors[variable.id]?.length > 0 && (
                      <div className="mt-1 space-y-0.5">
                        {validationErrors[variable.id].map((error, idx) => (
                          <p key={idx} className="text-xs text-yellow-500">
                            {error}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Value Input */}
                  <div className="md:col-span-5">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-sm text-gray-400">Value</label>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleSecret(variable.id)}
                          className={`p-1 rounded ${
                            variable.isSecret
                              ? "text-yellow-400 bg-yellow-900/20"
                              : "text-gray-400 hover:text-white"
                          }`}
                          title={
                            variable.isSecret
                              ? "Secret variable"
                              : "Mark as secret"
                          }
                        >
                          <FaLock className="w-3 h-3" />
                        </button>
                        {variable.isSecret && (
                          <button
                            onClick={() => toggleShowValue(variable.id)}
                            className="p-1 text-gray-400 hover:text-white"
                            title={
                              variable.showValue ? "Hide value" : "Show value"
                            }
                          >
                            {variable.showValue ? (
                              <FaEyeSlash className="w-3 h-3" />
                            ) : (
                              <FaEye className="w-3 h-3" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type={
                          variable.isSecret && !variable.showValue
                            ? "password"
                            : "text"
                        }
                        value={variable.value}
                        onChange={(e) =>
                          updateVariable(variable.id, "value", e.target.value)
                        }
                        placeholder={variable.placeholder || "Enter value"}
                        className="w-full font-mono text-sm bg-gray-900 border border-gray-700 text-white rounded-lg p-2.5 focus:outline-none focus:border-blue-500 pr-10"
                      />
                      {isVariableValid(variable.id) && (
                        <button
                          onClick={() =>
                            handleCopy(
                              `${variable.name}=${variable.value}`,
                              variable.id,
                            )
                          }
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-white"
                          title="Copy variable"
                        >
                          {copiedVar === variable.id ? (
                            <FaCheck className="w-3 h-3" />
                          ) : (
                            <FaCopy className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="md:col-span-2 flex items-center">
                    <button
                      onClick={() => removeVariable(variable.id)}
                      className="px-2 py-2 text-center bg-red-900/20 text-xs hover:bg-red-900/30 text-red-400 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                      disabled={envVars.length <= 1}
                    >
                      <FaTrash className="w-4 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Variable Button */}
          <button
            onClick={addVariable}
            className="w-full py-3 border-2 border-dashed border-gray-700 hover:border-gray-600 text-gray-400 hover:text-gray-300 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <FaPlus className="w-4 h-4" />
            Add Variable
          </button>
        </>
      )}

      {/* Stats */}
      <div className="flex items-center justify-between text-sm">
        <div className="text-gray-400">
          {envVars.filter((v) => v.name.trim() && v.value.trim()).length} of{" "}
          {envVars.length} variables configured
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <FaLock className="w-3 h-3 text-yellow-400" />
            <span className="text-gray-400">
              {envVars.filter((v) => v.isSecret).length} secret
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FaKey className="w-3 h-3 text-blue-400" />
            <span className="text-gray-400">
              {envVars.filter((v) => v.name.trim() && !v.value.trim()).length}{" "}
              incomplete
            </span>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-white">Preview</h3>
          <button
            onClick={() => handleCopy(generateMarkdown(), "preview")}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg"
          >
            {copiedVar === "preview" ? (
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

        {envVars.filter((v) => v.name.trim() && v.value.trim()).length > 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
              {generateMarkdown()}
            </pre>
          </div>
        ) : (
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8 text-center">
            <FaKey className="w-8 h-8 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500">No environment variables configured</p>
            <p className="text-sm text-gray-600 mt-1">
              Add variables above to see preview
            </p>
          </div>
        )}
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
          disabled={
            envVars.filter((v) => v.name.trim() && v.value.trim()).length === 0
          }
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            envVars.filter((v) => v.name.trim() && v.value.trim()).length === 0
              ? "bg-gray-800 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          Save
        </button>
      </div>

      {/* Help Text */}
      <div className="text-sm text-gray-500 space-y-2">
        <div className="flex items-start gap-2">
          <FaQuestionCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-gray-400">Best Practices:</p>
            <ul className="list-disc list-inside space-y-1 mt-1 ml-2">
              <li>Use UPPERCASE with underscores for variable names</li>
              <li>Mark sensitive data (API keys, passwords) as 🔒 secret</li>
              <li>Include only placeholder values for public repositories</li>
              <li>Use templates for common frameworks to save time</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
