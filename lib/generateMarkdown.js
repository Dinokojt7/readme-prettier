import { badgeConfig } from "./store-persist";

export const generateMarkdown = (state) => {
  // Generate badges inline
  const badgeSection = state.badges
    .map((id) =>
      badgeConfig[id]
        ? `[![${badgeConfig[id].label}](${badgeConfig[id].url})](${badgeConfig[id].link})`
        : "",
    )
    .filter(Boolean)
    .join(" ");

  const hasBadges = state.badges.length > 0;
  const hasLogo = state.projectLogo.trim() !== "";
  const hasAuthor = state.author.name.trim() !== "";

  let content = "";

  // Project Logo (if provided)
  if (hasLogo) {
    content += `<div align="center">\n\n`;
    content += `<img src="${state.projectLogo}" alt="${state.projectName}" width="100" />\n\n`;
    content += `</div>\n\n`;
  }

  // Project Title
  content += `# ${state.projectName || "Your Project Name"}\n\n`;

  // Badges Section
  if (hasBadges) {
    content += `<div align="center">\n\n`;
    content += `${badgeSection}\n\n`;
    content += `</div>\n\n`;
  }

  // Description
  content += `## 📋 Description\n\n`;
  content += `${state.projectDescription || "Add your project description here."}\n\n`;

  // Features
  content += `## ✨ Features\n\n`;
  const features = state.features.filter((f) => f.text.trim());
  if (features.length > 0) {
    features.forEach((feature) => {
      content += `- ${feature.emoji} ${feature.text}\n`;
    });
  } else {
    content += `- Add your first feature\n`;
  }
  content += `\n`;

  // Installation
  content += `## 🚀 Getting Started\n\n`;
  content += `${state.installation || "Add installation instructions here."}\n\n`;

  // Environment Variables
  if (state.environmentVariables.length > 0) {
    content += `## ⚙️ Environment Variables\n\n`;
    state.environmentVariables.forEach((v) => {
      content += `- \`${v.name}=${v.value}\`\n`;
    });
    content += `\n`;
  }

  // Author Section (if provided)
  if (hasAuthor) {
    content += `---\n\n`;
    content += `<p align="center">\n`;
    content += `  Made with ❤️ by <a href="${state.author.link || "#"}">${state.author.name}</a>\n`;
    content += `</p>\n\n`;
  }

  // Footer
  content += `---\n\n`;
  content += `*README generated with [readmepolished](${typeof window !== "undefined" ? window.location.origin : "#"})*\n`;

  return content;
};
