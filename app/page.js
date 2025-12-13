"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import StepNavigation from "@/components/StepNavigation";
import ProjectNameStep from "@/components/steps/ProjectNameStep";
import BadgesStep from "@/components/steps/BadgesStep";
import PreviewPanel from "@/components/PreviewPanel";
import useAppStore from "@/lib/store-persist";

// Dynamically import other steps
import dynamic from "next/dynamic";

// Component mapping
const stepComponents = {
  projectLogo: dynamic(() => import("@/components/steps/ProjectLogoStep"), {
    ssr: false,
  }),
  projectName: ProjectNameStep,
  description: dynamic(() => import("@/components/steps/DescriptionStep"), {
    ssr: false,
  }),
  badges: BadgesStep,
  features: dynamic(() => import("@/components/steps/FeaturesStep"), {
    ssr: false,
  }),
  installation: dynamic(() => import("@/components/steps/InstallationStep"), {
    ssr: false,
  }),
  environment: dynamic(() => import("@/components/steps/EnvironmentStep"), {
    ssr: false,
  }),
  projectStructure: dynamic(
    () => import("@/components/steps/ProjectStructureStep"),
    { ssr: false },
  ),
  author: dynamic(() => import("@/components/steps/AuthorStep"), {
    ssr: false,
  }),
  preview: dynamic(() => import("@/components/steps/PreviewStep"), {
    ssr: false,
  }),
};

export default function Home() {
  const { currentStep } = useAppStore();
  const CurrentStepComponent = stepComponents[currentStep] || ProjectNameStep;
  const [showPreview, setShowPreview] = useState(true);

  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      {/* Geometric dot pattern background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(100, 100, 100, 0.15) 1px, transparent 0)",
          backgroundSize: "24px 24px",
          backgroundPosition: "center center",
          zIndex: -1,
        }}
      />

      <main className="h-screen p-4 md:p-6 flex flex-col">
        {/* Header - Fixed */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-7xl mx-auto mb-6 flex-shrink-0"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
            readme<span className="text-blue-400">polished</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Craft your perfect README, one step at a time.
          </p>
        </motion.header>

        {/* Main Content Area - Takes remaining space */}
        <div className="max-w-7xl mx-auto flex-1 flex flex-col min-h-0 px-2 sm:px-4">
          {/* Step Navigation - Fixed */}
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="mb-6 flex-shrink-0"
          >
            <StepNavigation />
          </motion.div>

          {/* Combined Panels Container */}
          <div className="flex-1 flex flex-col min-h-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl shadow-2xl flex-1 flex flex-col overflow-hidden"
            >
              <div className="flex flex-col lg:flex-row flex-1 min-h-0 gap-2 sm:gap-4">
                {/* Left Panel: Wizard */}
                <div className="flex-1 border-r-0 lg:border-r border-gray-800 flex flex-col min-h-0">
                  <div className="p-4 md:p-6 flex-1 min-h-0 overflow-y-auto scrollable-panel">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="min-h-full"
                    >
                      <CurrentStepComponent />
                    </motion.div>
                  </div>
                </div>

                {/* Right Panel: Preview */}
                {showPreview && (
                  <div className="flex-1 border-t lg:border-t-0 border-gray-800 flex flex-col min-h-0">
                    <div className="p-4 md:p-6 flex-1 min-h-0 overflow-y-auto scrollable-panel">
                      <PreviewPanel onClose={() => setShowPreview(false)} />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Preview Toggle Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              onClick={() => setShowPreview(!showPreview)}
              className="mt-4 flex items-center gap-2 px-4 py-2 text-sm text-gray-300 bg-gray-900 border border-gray-800 rounded-lg hover:bg-gray-800 transition-colors duration-200 self-start flex-shrink-0"
            >
              {showPreview ? (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  Hide Preview
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                  Show Preview
                </>
              )}
            </motion.button>
          </div>
        </div>
      </main>
    </div>
  );
}
