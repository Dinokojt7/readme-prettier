"use client";

import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import StepNavigation from "@/components/StepNavigation";
import ProjectNameStep from "@/components/steps/ProjectNameStep";
import PreviewToggle from "@/components/PreviewToggle";
import useAppStore from "@/lib/store";

const PreviewPanel = dynamic(() => import("@/components/PreviewPanel"), {
  ssr: false,
  loading: () => <div className="h-full bg-gray-900 rounded-lg" />,
});

// Component mapping for each step
const stepComponents = {
  projectName: ProjectNameStep,
  description: dynamic(() => import("@/components/steps/DescriptionStep")),
  badges: dynamic(() => import("@/components/steps/BadgesStep")),
  features: dynamic(() => import("@/components/steps/FeaturesStep")),
  installation: dynamic(() => import("@/components/steps/InstallationStep")),
  environment: dynamic(() => import("@/components/steps/EnvironmentStep")),
  preview: dynamic(() => import("@/components/steps/PreviewStep")),
};

export default function Home() {
  const { currentStep } = useAppStore();
  const CurrentStepComponent = stepComponents[currentStep] || ProjectNameStep;

  return (
    <>
      <main className="min-h-screen p-6">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto mb-10 text-center"
        >
          <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">
            readme<span className="text-blue-400">polished</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Craft your perfect README, one step at a time.
          </p>
        </motion.header>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Panel: Wizard */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 shadow-2xl"
            >
              <StepNavigation />
              <div className="min-h-100">
                <AnimatePresence mode="wait">
                  <CurrentStepComponent key={currentStep} />
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Right Panel: Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 shadow-2xl"
            >
              <PreviewPanel />
            </motion.div>
          </div>
        </div>
      </main>

      <PreviewToggle />
    </>
  );
}
