import { create } from "zustand";

// Enhanced badge configuration with categories
export const badgeConfig = {
  // Frameworks
  nextjs: {
    label: "Next.js",
    color: "000000",
    url: "https://img.shields.io/badge/Next.js-black?logo=next.js&logoColor=white",
    link: "https://nextjs.org",
    category: "framework",
  },
  react: {
    label: "React",
    color: "61DAFB",
    url: "https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black",
    link: "https://reactjs.org",
    category: "framework",
  },
  vue: {
    label: "Vue.js",
    color: "4FC08D",
    url: "https://img.shields.io/badge/Vue.js-4FC08D?logo=vue.js&logoColor=white",
    link: "https://vuejs.org",
    category: "framework",
  },

  // Styling
  tailwind: {
    label: "Tailwind CSS",
    color: "38B2AC",
    url: "https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white",
    link: "https://tailwindcss.com",
    category: "styling",
  },
  bootstrap: {
    label: "Bootstrap",
    color: "7952B3",
    url: "https://img.shields.io/badge/Bootstrap-7952B3?logo=bootstrap&logoColor=white",
    link: "https://getbootstrap.com",
    category: "styling",
  },

  // Backend
  nodejs: {
    label: "Node.js",
    color: "339933",
    url: "https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white",
    link: "https://nodejs.org",
    category: "backend",
  },
  express: {
    label: "Express",
    color: "000000",
    url: "https://img.shields.io/badge/Express-black?logo=express&logoColor=white",
    link: "https://expressjs.com",
    category: "backend",
  },
  firebase: {
    label: "Firebase",
    color: "FFCA28",
    url: "https://img.shields.io/badge/Firebase-FFCA28?logo=firebase&logoColor=black",
    link: "https://firebase.google.com",
    category: "backend",
  },

  // Databases
  mongodb: {
    label: "MongoDB",
    color: "47A248",
    url: "https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white",
    link: "https://mongodb.com",
    category: "database",
  },
  postgresql: {
    label: "PostgreSQL",
    color: "4169E1",
    url: "https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white",
    link: "https://postgresql.org",
    category: "database",
  },

  // Tools
  npm: {
    label: "npm",
    color: "CB3837",
    url: "https://img.shields.io/badge/npm-CB3837?logo=npm&logoColor=white",
    link: "https://npmjs.com",
    category: "tool",
  },
  yarn: {
    label: "Yarn",
    color: "2C8EBB",
    url: "https://img.shields.io/badge/Yarn-2C8EBB?logo=yarn&logoColor=white",
    link: "https://yarnpkg.com",
    category: "tool",
  },
  vercel: {
    label: "Vercel",
    color: "000000",
    url: "https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white",
    link: "https://vercel.com",
    category: "deployment",
  },

  // Languages
  javascript: {
    label: "JavaScript",
    color: "F7DF1E",
    url: "https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black",
    link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    category: "language",
  },
  typescript: {
    label: "TypeScript",
    color: "3178C6",
    url: "https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white",
    link: "https://typescriptlang.org",
    category: "language",
  },
  python: {
    label: "Python",
    color: "3776AB",
    url: "https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white",
    link: "https://python.org",
    category: "language",
  },

  // License
  mit: {
    label: "License: MIT",
    color: "yellow",
    url: "https://img.shields.io/badge/License-MIT-yellow.svg",
    link: "https://opensource.org/licenses/MIT",
    category: "license",
  },
  apache: {
    label: "License: Apache 2.0",
    color: "blue",
    url: "https://img.shields.io/badge/License-Apache_2.0-blue.svg",
    link: "https://opensource.org/licenses/Apache-2.0",
    category: "license",
  },

  // Status
  maintained: {
    label: "Maintained",
    color: "success",
    url: "https://img.shields.io/badge/Maintained-Yes-success",
    link: "#",
    category: "status",
  },
  archived: {
    label: "Archived",
    color: "inactive",
    url: "https://img.shields.io/badge/Archived-Yes-inactive",
    link: "#",
    category: "status",
  },
};

// Helper function to search badges
export const searchBadges = (query) => {
  if (!query.trim()) return [];

  const searchTerm = query.toLowerCase();
  return Object.entries(badgeConfig)
    .filter(
      ([id, badge]) =>
        badge.label.toLowerCase().includes(searchTerm) ||
        badge.category.toLowerCase().includes(searchTerm) ||
        id.toLowerCase().includes(searchTerm),
    )
    .map(([id, badge]) => ({ id, ...badge }));
};

const useAppStore = create((set) => ({
  // Project Basics
  projectName: "",
  projectDescription: "",

  // Sections
  badges: [],
  features: [{ text: "", emoji: "🚀" }],
  installation: "",
  environmentVariables: [],

  // UI State
  currentStep: "projectName",
  isPreviewMaximized: false,

  // Actions
  updateField: (field, value) => set({ [field]: value }),
  addBadge: (badgeId) =>
    set((state) => ({
      badges: state.badges.includes(badgeId)
        ? state.badges.filter((id) => id !== badgeId) // Toggle off
        : [...state.badges, badgeId], // Toggle on
    })),
  addFeature: () =>
    set((state) => ({
      features: [...state.features, { text: "", emoji: "✨" }],
    })),
  updateFeature: (index, field, value) =>
    set((state) => {
      const newFeatures = [...state.features];
      newFeatures[index][field] = value;
      return { features: newFeatures };
    }),
}));

export default useAppStore;
