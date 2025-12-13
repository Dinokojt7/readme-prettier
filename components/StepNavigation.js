"use client";

import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import useAppStore from "@/lib/store";

const steps = [
  { id: "projectName", label: "Project" },
  { id: "description", label: "Description" },
  { id: "badges", label: "Badges" },
  { id: "features", label: "Features" },
  { id: "installation", label: "Installation" },
  { id: "environment", label: "Environment" },
  { id: "preview", label: "Preview" },
];

export default function StepNavigation() {
  const { currentStep, updateField } = useAppStore();
  const currentIndex = steps.findIndex((step) => step.id === currentStep);

  const goToStep = (stepId) => {
    updateField("currentStep", stepId);
  };

  const goNext = () => {
    if (currentIndex < steps.length - 1) {
      updateField("currentStep", steps[currentIndex + 1].id);
    }
  };

  const goBack = () => {
    if (currentIndex > 0) {
      updateField("currentStep", steps[currentIndex - 1].id);
    }
  };

  return (
    <div className="flex items-center justify-between mb-8">
      {/* Back Button */}
      <AnimatePresence>
        {currentIndex > 0 && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={goBack}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white border border-gray-800 hover:border-gray-600 rounded-lg transition-colors duration-200"
          >
            <FaChevronLeft className="w-3 h-3" />
            Back
          </motion.button>
        )}
      </AnimatePresence>

      {/* Step Indicators */}
      <div className="flex items-center gap-2">
        {steps.map((step, index) => (
          <motion.button
            key={step.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => goToStep(step.id)}
            className={`px-3 py-1 text-xs rounded-full transition-colors duration-200 ${
              step.id === currentStep
                ? "bg-white text-black font-semibold"
                : index < currentIndex
                  ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  : "bg-gray-900 text-gray-500 hover:bg-gray-800"
            }`}
          >
            {step.label}
          </motion.button>
        ))}
      </div>

      {/* Next Button */}
      <AnimatePresence>
        {currentIndex < steps.length - 1 && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={goNext}
            className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors duration-200"
          >
            Next
            <FaChevronRight className="w-3 h-3" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
