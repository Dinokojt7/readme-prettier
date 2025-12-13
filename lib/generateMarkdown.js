import { badgeConfig } from "./store";

export const generateMarkdown = (state) => {
  // Generate badge section with better formatting
  const badgeSection = state.badges
    .map((id) =>
      badgeConfig[id]
        ? `[![${badgeConfig[id].label}](${badgeConfig[id].url})](${badgeConfig[id].link})`
        : "",
    )
    .filter(Boolean)
    .join(" ");

  const hasBadges = state.badges.length > 0;

  return `# ${state.projectName || "Your Project Name"}

${hasBadges ? `<div align="center">\n\n${badgeSection}\n\n</div>\n\n` : ""}## 📋 Description
${state.projectDescription || "Add your project description here."}

## ✨ Features
${
  state.features
    .filter((f) => f.text.trim())
    .map((f) => `- ${f.emoji} ${f.text}`)
    .join("\n") || "- Add your first feature"
}

## 🚀 Getting Started
${state.installation || "Add installation instructions here."}

## ⚙️ Environment Variables
${
  state.environmentVariables.length > 0
    ? state.environmentVariables
        .map((v) => `- \`${v.name}=${v.value}\``)
        .join("\n")
    : "Add your environment variables here."
}

${hasBadges ? `\n---\n\n*Badges powered by [Shields.io](https://shields.io)*` : ""}

---
*README generated with [readmepolished](${typeof window !== "undefined" ? window.location.origin : "#"})*
`;
};
