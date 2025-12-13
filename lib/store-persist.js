import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Enhanced badge configuration with latest versions
export const badgeConfig = {
  // Frameworks
  nextjs: {
    label: "Next.js",
    message: "16.0.10",
    color: "000000",
    url: "https://img.shields.io/badge/Next.js-16.0.10-black?logo=next.js&logoColor=white",
    link: "https://nextjs.org",
    category: "framework",
  },
  react: {
    label: "React",
    message: "19.2.1",
    color: "61DAFB",
    url: "https://img.shields.io/badge/React-19.2.1-61DAFB?logo=react&logoColor=black",
    link: "https://reactjs.org",
    category: "framework",
  },

  // Styling
  tailwind: {
    label: "Tailwind CSS",
    message: "3.4.17",
    color: "38B2AC",
    url: "https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?logo=tailwindcss&logoColor=white",
    link: "https://tailwindcss.com",
    category: "styling",
  },

  // Backend
  firebase: {
    label: "Firebase",
    message: "Cloud",
    color: "FFCA28",
    url: "https://img.shields.io/badge/Firebase-Cloud-FFCA28?logo=firebase&logoColor=black",
    link: "https://firebase.google.com",
    category: "backend",
  },

  // Deployment
  vercel: {
    label: "Deploy with Vercel",
    message: "",
    color: "000000",
    url: "https://img.shields.io/badge/Deploy_with_Vercel-000000?logo=vercel&logoColor=white",
    link: "https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FDinokojt7%2Fizinto-landing-page.git",
    category: "deployment",
  },

  // Languages
  javascript: {
    label: "JavaScript",
    message: "ES2023",
    color: "F7DF1E",
    url: "https://img.shields.io/badge/JavaScript-ES2023-F7DF1E?logo=javascript&logoColor=black",
    link: "https://262.ecma-international.org/14.0/",
    category: "language",
  },

  // Tools
  npm: {
    label: "npm",
    message: "10+",
    color: "CB3837",
    url: "https://img.shields.io/badge/npm-10+-CB3837?logo=npm&logoColor=white",
    link: "https://www.npmjs.com",
    category: "tool",
  },

  // License
  mit: {
    label: "License",
    message: "MIT",
    color: "yellow",
    url: "https://img.shields.io/badge/License-MIT-yellow.svg",
    link: "https://opensource.org/licenses/MIT",
    category: "license",
  },

  // State Management
  zustand: {
    label: "Zustand",
    message: "5",
    color: "614A44",
    url: "https://img.shields.io/badge/Zustand-5-614A44?logo=zustand&logoColor=white",
    link: "https://zustand-demo.pmnd.rs/",
    category: "tool",
  },

  // Animations
  framer: {
    label: "Framer Motion",
    message: "11",
    color: "F24B1B",
    url: "https://img.shields.io/badge/Framer_Motion-11-F24B1B?logo=framer&logoColor=white",
    link: "https://www.framer.com/motion/",
    category: "tool",
  },

  // Additional
  axios: {
    label: "Axios",
    message: "1",
    color: "5A29E4",
    url: "https://img.shields.io/badge/Axios-1-5A29E4?logo=axios&logoColor=white",
    link: "https://axios-http.com/",
    category: "tool",
  },
  googlemaps: {
    label: "Google Maps API",
    message: "3",
    color: "4285F4",
    url: "https://img.shields.io/badge/Google_Maps_API-3-4285F4?logo=googlemaps&logoColor=white",
    link: "https://developers.google.com/maps",
    category: "tool",
  },
};

// Create a reactive store WITHOUT persist first
const createStore = (set, get) => ({
  // Project Basics
  projectName: "",
  projectDescription: "",
  projectLogo: "",
  projectMedia: [],

  // Sections
  badges: [],
  features: [{ text: "", emoji: "🚀" }],
  installation: "",
  environmentVariables: [],
  projectStructure: "",
  author: { name: "", link: "" },

  // UI State
  currentStep: "projectName",
  isPreviewMaximized: true,
  lastUpdate: Date.now(), // Add this to force re-renders

  // Actions
  updateField: (field, value) =>
    set({
      [field]: value,
      lastUpdate: Date.now(), // Force update on every change
    }),

  addBadge: (badgeId) =>
    set((state) => ({
      badges: state.badges.includes(badgeId)
        ? state.badges.filter((id) => id !== badgeId)
        : [...state.badges, badgeId],
      lastUpdate: Date.now(),
    })),

  addFeature: () =>
    set((state) => ({
      features: [...state.features, { text: "", emoji: "✨" }],
      lastUpdate: Date.now(),
    })),

  updateFeature: (index, field, value) =>
    set((state) => {
      const newFeatures = [...state.features];
      newFeatures[index][field] = value;
      return {
        features: newFeatures,
        lastUpdate: Date.now(),
      };
    }),

  addMedia: (url) =>
    set((state) => ({
      projectMedia: [...state.projectMedia, url],
      lastUpdate: Date.now(),
    })),

  updateAuthor: (field, value) =>
    set((state) => ({
      author: { ...state.author, [field]: value },
      lastUpdate: Date.now(),
    })),

  resetStore: () =>
    set({
      projectName: "",
      projectDescription: "",
      projectLogo: "",
      projectMedia: [],
      badges: [],
      features: [{ text: "", emoji: "🚀" }],
      installation: "",
      environmentVariables: [],
      projectStructure: "",
      author: { name: "", link: "" },
      currentStep: "projectName",
      lastUpdate: Date.now(),
    }),

  // Force a preview update
  triggerPreviewUpdate: () => set({ lastUpdate: Date.now() }),
});

// Create the store with persist
const useAppStore = create(
  persist(createStore, {
    name: "readmepolished-store",
    storage: createJSONStorage(() => localStorage),
    version: 1,
    // Only persist these fields (exclude UI state if needed)
    partialize: (state) => ({
      projectName: state.projectName,
      projectDescription: state.projectDescription,
      projectLogo: state.projectLogo,
      projectMedia: state.projectMedia,
      badges: state.badges,
      features: state.features,
      installation: state.installation,
      environmentVariables: state.environmentVariables,
      projectStructure: state.projectStructure,
      author: state.author,
    }),
  }),
);

export default useAppStore;
