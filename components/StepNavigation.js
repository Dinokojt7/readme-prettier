"use client";

import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import useAppStore from "@/lib/store-persist";

const steps = [
  { id: "projectLogo", label: "Logo" },
  { id: "projectName", label: "Project" },
  { id: "description", label: "Description" },
  { id: "badges", label: "Badges" },
  { id: "features", label: "Features" },
  { id: "installation", label: "Installation" },
  { id: "environment", label: "Environment" },
  { id: "projectStructure", label: "Structure" },
  { id: "author", label: "Author" },
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
      {/* Step Indicators */}
      <div className="flex items-center gap-2">
        {steps.map((step, index) => (
          <motion.button
            key={step.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => goToStep(step.id)}
            className={`px-3 py-1.5 text-xs rounded-md transition-colors duration-200 ${
              step.id === currentStep
                ? "hover:bg-gray-800 text-white font-semibold border-b-2 border-orange-500"
                : index < currentIndex
                  ? " text-white hover:bg-gray-800"
                  : " text-white hover:bg-gray-800"
            }`}
          >
            {step.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
