"use client";

import { useState, useRef } from "react";
import { FaSmile } from "react-icons/fa";
import GlobalEmojiPicker from "./GlobalEmojiPicker";

export default function InputWithEmoji({
  id,
  value,
  onChange,
  placeholder,
  type = "text",
  rows,
  className = "",
  ...props
}) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const inputRef = useRef(null);

  const handleEmojiSelect = (emoji) => {
    if (inputRef.current) {
      const input = inputRef.current;
      const start = input.selectionStart;
      const end = input.selectionEnd;
      const currentValue = input.value;

      // Insert emoji at cursor
      const newValue =
        currentValue.substring(0, start) + emoji + currentValue.substring(end);

      // Update the React state via onChange
      if (onChange) {
        const syntheticEvent = {
          target: {
            value: newValue,
            id: id,
            name: props.name || id,
          },
        };
        onChange(syntheticEvent);
      }

      // Update the input value for immediate feedback
      input.value = newValue;

      // Move cursor after emoji
      setTimeout(() => {
        input.focus();
        input.setSelectionRange(start + emoji.length, start + emoji.length);
      }, 10);
    }

    setShowEmojiPicker(false);
  };

  return (
    <div className="relative">
      {type === "textarea" ? (
        <textarea
          ref={inputRef}
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          className={`w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12 ${className}`}
          {...props}
        />
      ) : (
        <input
          ref={inputRef}
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12 ${className}`}
          {...props}
        />
      )}

      {/* Emoji Button */}
      <button
        type="button"
        onClick={() => setShowEmojiPicker(true)}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
        title="Insert emoji"
      >
        <FaSmile className="w-5 h-5" />
      </button>

      {/* Emoji Picker */}
      <GlobalEmojiPicker
        isOpen={showEmojiPicker}
        onClose={() => setShowEmojiPicker(false)}
        onSelect={handleEmojiSelect}
        targetInputId={id}
      />
    </div>
  );
}
