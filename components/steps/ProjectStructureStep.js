"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaFolder,
  FaFile,
  FaFolderPlus,
  FaTrash,
  FaCode,
  FaIndent,
  FaCopy,
  FaCheck,
  FaEdit,
  FaFileAlt,
  FaTimes,
  FaSave,
  FaEllipsisH,
} from "react-icons/fa";
import useAppStore from "@/lib/store-persist";

const structureTemplates = [
  {
    name: "Next.js App Router",
    value: `src/
├── app/
│   ├── (routes)/
│   ├── api/
│   └── globals.css
├── components/
│   ├── ui/
│   └── layout/
├── lib/
│   ├── utils/
│   └── api/
└── public/`,
  },
  {
    name: "React + Vite",
    value: `src/
├── components/
│   ├── common/
│   └── features/
├── hooks/
├── utils/
├── styles/
├── assets/
└── App.jsx`,
  },
  {
    name: "Node.js API",
    value: `src/
├── controllers/
├── models/
├── routes/
├── middleware/
├── utils/
├── config/
└── server.js`,
  },
  {
    name: "Simple Frontend",
    value: `public/
├── index.html
├── favicon.ico
└── assets/
src/
├── components/
├── pages/
├── utils/
└── App.js`,
  },
];

const FILE_TYPES = {
  folder: { icon: "📁", color: "text-blue-400" },
  file: { icon: "📄", color: "text-gray-400" },
  config: { icon: "⚙️", color: "text-yellow-400" },
  style: { icon: "🎨", color: "text-pink-400" },
  script: { icon: "📜", color: "text-green-400" },
  image: { icon: "🖼️", color: "text-purple-400" },
  test: { icon: "🧪", color: "text-red-400" },
};

// Helper to detect file type (preserves folder status)
const detectFileType = (name, wasFolder = false) => {
  // If it was a folder and ends with /, keep it as folder
  if (wasFolder && name.endsWith("/")) return "folder";

  // Otherwise detect normally
  if (name.endsWith("/")) return "folder";
  if (
    name.includes(".json") ||
    name.includes(".config") ||
    name.includes(".env")
  )
    return "config";
  if (name.includes(".css") || name.includes(".scss") || name.includes(".sass"))
    return "style";
  if (
    name.includes(".js") ||
    name.includes(".ts") ||
    name.includes(".jsx") ||
    name.includes(".tsx")
  )
    return "script";
  if (name.match(/\.(png|jpg|jpeg|gif|svg|ico|webp)$/i)) return "image";
  if (
    name.includes(".test.") ||
    name.includes(".spec.") ||
    name.includes("test/")
  )
    return "test";
  return "file";
};

// Helper to parse tree structure
const parseTreeToItems = (treeString) => {
  if (!treeString.trim()) return [];

  const lines = treeString.split("\n");
  const items = [];
  let idCounter = 1;

  lines.forEach((line, lineIndex) => {
    if (!line.trim()) return;

    // Calculate indentation level
    const indentMatch = line.match(/^[\s│├└─]*/);
    const prefix = indentMatch[0];
    const indentLevel = (prefix.match(/│/g) || []).length;

    // Clean the line
    const cleanName = line.replace(/^[\s│├└─]+/, "").trim();
    if (!cleanName) return;

    const type = detectFileType(cleanName);

    items.push({
      id: idCounter++,
      name: cleanName,
      type,
      indent: indentLevel,
      isEditing: false,
      wasFolder: type === "folder", // Track if it was originally a folder
    });
  });

  return items;
};

// Helper to generate tree structure
const generateTreeFromItems = (items) => {
  if (items.length === 0) return "";

  const lines = [];

  items.forEach((item, index) => {
    let prefix = "";
    const isLast =
      index === items.length - 1 || items[index + 1].indent <= item.indent;

    for (let i = 0; i < item.indent; i++) {
      if (i === item.indent - 1) {
        prefix += isLast ? "└── " : "├── ";
      } else {
        const isParentLast = items
          .slice(0, index)
          .some(
            (prevItem, prevIndex) =>
              prevItem.indent === i &&
              items
                .slice(prevIndex + 1, index + 1)
                .every((nextItem) => nextItem.indent > i),
          );
        prefix += isParentLast ? "    " : "│   ";
      }
    }

    lines.push(prefix + item.name);
  });

  return lines.join("\n");
};

export default function ProjectStructureStep() {
  const { projectStructure, updateField } = useAppStore();
  const [treeItems, setTreeItems] = useState([]);
  const [copiedItem, setCopiedItem] = useState(null);
  const [showTreeBuilder, setShowTreeBuilder] = useState(true);
  const [indentation, setIndentation] = useState(2);
  const [showHelp, setShowHelp] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState(null);
  const editInputRef = useRef(null);
  const actionMenuRef = useRef(null);

  // Initialize from store
  useEffect(() => {
    if (projectStructure) {
      const parsedItems = parseTreeToItems(projectStructure);
      setTreeItems(parsedItems);
    } else {
      setTreeItems([]);
    }
  }, [projectStructure]);

  // Focus edit input when editing starts
  useEffect(() => {
    if (editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [treeItems.filter((item) => item.isEditing).length]);

  // Close action menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        actionMenuRef.current &&
        !actionMenuRef.current.contains(event.target)
      ) {
        setShowActionsMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addItem = (type = "folder", indent = 0) => {
    const newId = Date.now();
    const defaultName =
      type === "folder"
        ? "new-folder/"
        : `new-file.${type === "script" ? "js" : "txt"}`;

    const newItem = {
      id: newId,
      name: defaultName,
      type,
      indent,
      isEditing: true,
      wasFolder: type === "folder",
    };

    setTreeItems([...treeItems, newItem]);
    setShowActionsMenu(null);
  };

  const addChildItem = (parentIndex, type = "file") => {
    const parentItem = treeItems[parentIndex];
    if (!parentItem) return;

    const newId = Date.now();
    const defaultName =
      type === "folder"
        ? "child-folder/"
        : `child-file.${type === "script" ? "js" : "txt"}`;

    const newItem = {
      id: newId,
      name: defaultName,
      type,
      indent: parentItem.indent + 1,
      isEditing: true,
      wasFolder: type === "folder",
    };

    // Insert after the parent and any existing children
    let insertIndex = parentIndex + 1;
    while (
      insertIndex < treeItems.length &&
      treeItems[insertIndex].indent > parentItem.indent
    ) {
      insertIndex++;
    }

    const newItems = [...treeItems];
    newItems.splice(insertIndex, 0, newItem);
    setTreeItems(newItems);
    setShowActionsMenu(null);
  };

  // Start editing an item
  const startEditingItem = (itemId) => {
    setTreeItems(
      treeItems.map((item) =>
        item.id === itemId ? { ...item, isEditing: true } : item,
      ),
    );
    setShowActionsMenu(null);
  };

  // Update item name while preserving folder/file type
  const handleNameChange = (itemId, newName) => {
    setTreeItems(
      treeItems.map((item) => {
        if (item.id === itemId) {
          const wasFolder = item.wasFolder || item.type === "folder";
          const type = detectFileType(newName, wasFolder);

          // If it was a folder and user removes trailing slash, add it back
          let finalName = newName;
          if (wasFolder && !newName.endsWith("/")) {
            finalName = newName + "/";
          }

          return {
            ...item,
            name: finalName,
            type,
            wasFolder: wasFolder || type === "folder",
          };
        }
        return item;
      }),
    );
  };

  // Finish editing an item
  const finishEditingItem = (itemId) => {
    setTreeItems(
      treeItems.map((item) =>
        item.id === itemId ? { ...item, isEditing: false } : item,
      ),
    );
  };

  const removeItem = (index) => {
    const item = treeItems[index];
    if (!item) return;

    // Find range of items to remove (item + all children)
    let removeCount = 1;
    for (let i = index + 1; i < treeItems.length; i++) {
      if (treeItems[i].indent > item.indent) {
        removeCount++;
      } else {
        break;
      }
    }

    const newItems = [...treeItems];
    newItems.splice(index, removeCount);
    setTreeItems(newItems);
    setShowActionsMenu(null);
  };

  const applyTemplate = (templateValue) => {
    const parsedItems = parseTreeToItems(templateValue);
    setTreeItems(parsedItems);
    updateField("projectStructure", templateValue);
    setShowActionsMenu(null);
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
    const structure = generateTreeFromItems(treeItems);
    updateField("projectStructure", structure);
    setShowActionsMenu(null);
  };

  const handleReset = () => {
    setTreeItems([]);
    updateField("projectStructure", "");
    setShowActionsMenu(null);
  };

  const renderTreeItem = (item, index) => {
    const fileType = FILE_TYPES[item.type] || FILE_TYPES.file;
    const indentPadding = item.indent * 24;
    const isActionsMenuOpen = showActionsMenu === item.id;

    return (
      <div
        key={item.id}
        className="flex items-center gap-2 py-2 hover:bg-gray-800/30 rounded-lg px-2 transition-colors group min-w-0"
        style={{ marginLeft: `${indentPadding}px` }}
      >
        {/* Indentation lines */}
        <div className="flex items-center flex-shrink-0">
          {Array.from({ length: item.indent }).map((_, i) => (
            <div
              key={i}
              className="w-6 h-full flex items-center justify-center"
            >
              <div className="w-px h-full bg-gray-700"></div>
            </div>
          ))}
        </div>

        {/* Icon */}
        <span className={`text-lg ${fileType.color} flex-shrink-0`}>
          {fileType.icon}
        </span>

        {/* Name Input/Display */}
        {item.isEditing ? (
          <div className="flex-1 min-w-0">
            <input
              ref={item.isEditing ? editInputRef : null}
              type="text"
              value={item.name}
              onChange={(e) => handleNameChange(item.id, e.target.value)}
              onBlur={() => finishEditingItem(item.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  finishEditingItem(item.id);
                }
                if (e.key === "Escape") {
                  finishEditingItem(item.id);
                }
              }}
              className="w-full bg-gray-900 border border-blue-500 rounded px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 truncate"
              placeholder="Enter name..."
            />
          </div>
        ) : (
          <div
            className="flex-1 min-w-0 cursor-pointer"
            onClick={() => startEditingItem(item.id)}
            onDoubleClick={() => startEditingItem(item.id)}
          >
            <span className="text-gray-300 hover:text-white text-sm font-mono truncate block">
              {item.name}
            </span>
          </div>
        )}

        {/* Responsive Action Buttons */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Always visible essential actions */}
          <div className="hidden sm:flex items-center gap-1">
            {item.type === "folder" && (
              <button
                onClick={() => addChildItem(index, "folder")}
                className="p-1.5 text-gray-400 hover:text-blue-400 transition-colors"
                title="Add subfolder"
              >
                <FaFolderPlus className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => addChildItem(index, "file")}
              className="p-1.5 text-gray-400 hover:text-green-400 transition-colors"
              title="Add file here"
            >
              <FaFileAlt className="w-4 h-4" />
            </button>
          </div>

          {/* Dropdown menu for smaller screens or overflow actions */}
          <div className="relative" ref={actionMenuRef}>
            <button
              onClick={() =>
                setShowActionsMenu(isActionsMenuOpen ? null : item.id)
              }
              className="p-1.5 text-gray-400 hover:text-white transition-colors"
              title="More actions"
            >
              <FaEllipsisH className="w-4 h-4" />
            </button>

            {/* Actions Dropdown Menu */}
            {isActionsMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 top-full mt-1 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 min-w-[140px] py-1"
              >
                <button
                  onClick={() => startEditingItem(item.id)}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition-colors text-left"
                >
                  <FaEdit className="w-3 h-3 flex-shrink-0" />
                  Rename
                </button>

                {item.type === "folder" && (
                  <button
                    onClick={() => {
                      addChildItem(index, "folder");
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition-colors text-left"
                  >
                    <FaFolderPlus className="w-3 h-3 flex-shrink-0" />
                    Add Subfolder
                  </button>
                )}

                <button
                  onClick={() => {
                    addChildItem(index, "file");
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition-colors text-left"
                >
                  <FaFileAlt className="w-3 h-3 flex-shrink-0" />
                  Add File Here
                </button>

                <div className="border-t border-gray-800 my-1"></div>

                <button
                  onClick={() => removeItem(index)}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 transition-colors text-left"
                >
                  <FaTrash className="w-3 h-3 flex-shrink-0" />
                  Delete
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const generatedStructure = generateTreeFromItems(treeItems);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">
          📁 Project Structure
        </h2>
        <p className="text-gray-400 text-sm">
          Build your project's file structure visually
        </p>
      </div>

      {/* Template Selection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-white">Quick Templates</h3>
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            {showHelp ? "Hide Help" : "Show Help"}
          </button>
        </div>

        <AnimatePresence>
          {showHelp && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-4 overflow-hidden"
            >
              <p className="text-sm text-blue-300">
                <strong>Tip:</strong> Start with a template, then customize.
                Click items to rename, use the ⋮ menu for more actions.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {structureTemplates.map((template) => (
            <button
              key={template.name}
              onClick={() => applyTemplate(template.value)}
              className="p-4 border border-gray-800 rounded-lg hover:border-gray-700 hover:bg-gray-800/50 transition-colors text-left group"
            >
              <div className="flex items-center gap-3 mb-2">
                <FaFolder className="w-5 h-5 text-blue-400 transition-transform group-hover:scale-110" />
                <p className="text-sm font-medium text-white truncate">
                  {template.name}
                </p>
              </div>
              <pre className="text-xs text-gray-400 font-mono overflow-hidden truncate">
                {template.value.split("\n")[0]}
                {template.value.split("\n").length > 1 && "..."}
              </pre>
            </button>
          ))}
        </div>
      </div>

      {/* Builder Controls */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-white">Visual Builder</h3>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowTreeBuilder(!showTreeBuilder)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
            >
              {showTreeBuilder ? (
                <>
                  <FaCode className="w-3 h-3" />
                  <span className="hidden sm:inline">Text Editor</span>
                </>
              ) : (
                <>
                  <FaFolder className="w-3 h-3" />
                  <span className="hidden sm:inline">Visual Builder</span>
                </>
              )}
            </button>

            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm text-gray-400">Indent:</span>
              <select
                value={indentation}
                onChange={(e) => setIndentation(Number(e.target.value))}
                className="bg-gray-900 border border-gray-700 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-blue-500"
              >
                {[2, 4, 6, 8].map((num) => (
                  <option key={num} value={num}>
                    {num} spaces
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Tree Builder */}
      {showTreeBuilder ? (
        <div className="space-y-4">
          {/* Add Root Items */}
          <div className="flex flex-wrap items-center gap-3 p-3 bg-gray-800/30 rounded-lg border border-dashed border-gray-700">
            <span className="text-gray-400 text-sm">Add at root level:</span>
            <button
              onClick={() => addItem("folder", 0)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
            >
              <FaFolderPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Folder</span>
            </button>
            <button
              onClick={() => addItem("file", 0)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
            >
              <FaFileAlt className="w-4 h-4" />
              <span className="hidden sm:inline">File</span>
            </button>
          </div>

          {/* Tree Items */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 min-h-[200px] overflow-x-auto">
            {treeItems.length === 0 ? (
              <div className="text-center py-8">
                <FaFolder className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500">No items yet</p>
                <p className="text-sm text-gray-600 mt-1">
                  Add folders and files above, or start with a template
                </p>
              </div>
            ) : (
              <div className="space-y-1 min-w-max">
                {treeItems.map((item, index) => renderTreeItem(item, index))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Text Editor */
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-300">
              Edit Structure Text
            </label>
            <button
              onClick={() => handleCopy(projectStructure || "", "structure")}
              className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors"
            >
              {copiedItem === "structure" ? (
                <>
                  <FaCheck className="w-3 h-3" />
                  <span className="hidden sm:inline">Copied</span>
                </>
              ) : (
                <>
                  <FaCopy className="w-3 h-3" />
                  <span className="hidden sm:inline">Copy</span>
                </>
              )}
            </button>
          </div>

          <div className="relative">
            <FaCode className="absolute left-4 top-4 text-gray-500 w-4 h-4" />
            <textarea
              value={projectStructure || ""}
              onChange={(e) => updateField("projectStructure", e.target.value)}
              placeholder={`src/
├── app/
│   ├── page.js
│   └── layout.js
├── components/
├── lib/
└── package.json`}
              rows={12}
              className="w-full pl-12 pr-4 py-4 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 font-mono text-sm resize-none"
            />
          </div>
        </div>
      )}

      {/* Generated Preview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-white">Preview</h3>
          <button
            onClick={() => handleCopy(generatedStructure, "preview")}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
          >
            {copiedItem === "preview" ? (
              <>
                <FaCheck className="w-3 h-3" />
                <span className="hidden sm:inline">Copied</span>
              </>
            ) : (
              <>
                <FaCopy className="w-3 h-3" />
                <span className="hidden sm:inline">Copy</span>
              </>
            )}
          </button>
        </div>

        {generatedStructure ? (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-300 font-mono whitespace-pre leading-relaxed">
              {generatedStructure}
            </pre>
          </div>
        ) : (
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8 text-center">
            <FaCode className="w-8 h-8 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500">No structure defined</p>
            <p className="text-sm text-gray-600 mt-1">
              {showTreeBuilder
                ? "Add items in the visual builder above"
                : "Add structure in the text editor above"}
            </p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm gap-2">
        <div className="text-gray-400">
          {treeItems.length} item{treeItems.length !== 1 ? "s" : ""}
          {treeItems.length > 0 &&
            ` • ${treeItems.filter((i) => i.type === "folder").length} folders`}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <FaFolder className="w-4 h-4 text-blue-400" />
            <span className="text-gray-400">Folders</span>
          </div>
          <div className="flex items-center gap-2">
            <FaFileAlt className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400">Files</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between pt-4 border-t border-gray-800 gap-3">
        <button
          onClick={handleReset}
          className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-700 hover:border-gray-600 text-gray-300 rounded-lg font-medium transition-colors"
        >
          <FaTimes className="w-4 h-4" />
          Reset
        </button>
        <button
          onClick={handleSave}
          className="flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          <FaSave className="w-4 h-4" />
          Save
        </button>
      </div>

      {/* Help Text */}
      <div className="text-sm text-gray-500 space-y-2">
        <div className="flex items-start gap-2">
          <FaIndent className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-gray-400">Visual Builder Tips:</p>
            <ul className="list-disc list-inside space-y-1 mt-1 ml-2">
              <li>Click on any item to rename it</li>
              <li>Use the ⋮ menu for adding subfolders/files or deleting</li>
              <li>Folders automatically keep their "/" suffix when renaming</li>
              <li>File types are detected by extension (e.g., .js, .css)</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
