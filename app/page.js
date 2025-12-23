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
    <div className="fixed inset-0 overflow-hidden bg-[#0d1117] ">
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
          className="max-w-7xl flex items-start justify-between mx-auto pb-4 mb-6 border-b border-white/20 flex-shrink-0 w-full"
        >
          {/* Logo instead of text */}
          <div className="flex items-center gap-3">
            <div className="w-40 h-auto relative">
              <img
                src="/images/logomark.png"
                alt="readmepolished"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Move StepNavigation here (was in separate div below) */}
          <div className="hidden lg:block">
            <StepNavigation />
          </div>
        </motion.header>

        {/* Main Content Area - Takes remaining space */}
        <div className="max-w-7xl mx-auto flex-1 flex flex-col min-h-0 w-full">
          {/* Step Navigation - Fixed */}
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="mb-6 flex-shrink-0"
          ></motion.div>

          {/* Combined Panels Container - Fixed grid */}
          <div className="flex-1 flex flex-col min-h-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-gray-900/20 backdrop-blur-sm border border-gray-800 rounded shadow-2xl flex-1 flex flex-col overflow-hidden"
            >
              {/* Fixed Grid Container - Equal width panels */}
              <div className="flex flex-col lg:flex-row flex-1 min-h-0">
                {/* Left Panel: Wizard - Fixed 50% width */}
                <div
                  className={`flex flex-col min-h-0 ${showPreview ? "lg:w-1/2" : "w-full"}`}
                >
                  <div className="p-4 md:p-6 flex-1 min-h-0 overflow-y-auto scrollable-panel">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="min-h-full max-w-2xl mx-auto"
                    >
                      <CurrentStepComponent />
                    </motion.div>
                  </div>
                </div>

                {/* Right Panel: Preview - Fixed 50% width */}
                {showPreview && (
                  <div className="flex flex-col min-h-0 lg:w-1/2 border-t lg:border-t-0 lg:border-l border-gray-800">
                    <div className="p-4 md:p-6 flex-1 min-h-0 overflow-y-auto scrollable-panel">
                      <PreviewPanel onClose={() => setShowPreview(false)} />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
