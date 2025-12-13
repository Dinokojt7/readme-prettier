import { badgeConfig } from "./store-persist";

export const generateMarkdown = (state) => {
  // Generate badges section (separate from title)
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
  const hasFeatures = state.features.some((f) => f.text.trim());
  const hasInstallation = state.installation.trim() !== "";
  const hasEnvVars = state.environmentVariables.length > 0;
  const hasStructure = state.projectStructure.trim() !== "";

  let content = "";

  // Project Title (centered)
  content += `# ${state.projectName || "Your Project Name"}\n\n`;

  // Badges Section (centered, below title)
  if (hasBadges) {
    content += `<div align="start" class="inline-badge-container">\n\n`;
    content += `${badgeSection}\n\n`;
    content += `</div>\n\n`;
  }

  // Description (NO header, just plain text)
  if (state.projectDescription.trim()) {
    content += `${state.projectDescription}\n\n`;
  }

  // Features Section
  if (hasFeatures) {
    content += `## :fire: Core Features\n\n`;

    // Group features by category if they have categories
    const categorizedFeatures = {};
    const uncategorized = [];

    state.features.forEach((feature) => {
      if (feature.text.trim()) {
        // Check if feature has a category (e.g., "Service Categories:")
        if (feature.text.includes(":")) {
          const [category, ...rest] = feature.text.split(":");
          const trimmedCategory = category.trim();
          const featureText = rest.join(":").trim();

          if (featureText) {
            if (!categorizedFeatures[trimmedCategory]) {
              categorizedFeatures[trimmedCategory] = [];
            }
            categorizedFeatures[trimmedCategory].push({
              emoji: feature.emoji,
              text: featureText,
            });
          } else {
            uncategorized.push(feature);
          }
        } else {
          uncategorized.push(feature);
        }
      }
    });

    // Render categorized features
    Object.entries(categorizedFeatures).forEach(([category, features]) => {
      content += `### ${category}\n\n`;
      features.forEach((f) => {
        content += `- ${f.emoji} ${f.text}\n`;
      });
      content += `\n`;
    });

    // Render uncategorized features
    if (uncategorized.length > 0) {
      uncategorized.forEach((f) => {
        content += `- ${f.emoji} ${f.text}\n`;
      });
      content += `\n`;
    }
  }

  // Tech Stack Section
  const techStackItems = [];
  if (state.badges.includes("nextjs"))
    techStackItems.push(
      "- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)",
    );
  if (state.badges.includes("react"))
    techStackItems.push("- **UI Library**: [React](https://reactjs.org/)");
  if (state.badges.includes("javascript"))
    techStackItems.push("- **Language**: JavaScript (ES2023+)");
  if (state.badges.includes("tailwind"))
    techStackItems.push(
      "- **Styling**: [Tailwind CSS](https://tailwindcss.com/)",
    );
  if (state.badges.includes("zustand"))
    techStackItems.push(
      "- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)",
    );
  if (state.badges.includes("framer"))
    techStackItems.push(
      "- **Animations**: [Framer Motion](https://www.framer.com/motion/)",
    );
  if (state.badges.includes("firebase"))
    techStackItems.push(
      "- **Backend & Auth**: [Firebase](https://firebase.google.com/) (Auth, Firestore)",
    );
  if (state.badges.includes("npm"))
    techStackItems.push("- **Package Manager**: [npm](https://www.npmjs.com/)");
  if (state.badges.includes("vercel"))
    techStackItems.push("- **Deployment**: [Vercel](https://vercel.com/)");
  if (state.badges.includes("googlemaps"))
    techStackItems.push(
      "- **Maps**: [Google Maps API](https://developers.google.com/maps)",
    );
  if (state.badges.includes("axios"))
    techStackItems.push("- **HTTP Client**: [Axios](https://axios-http.com/)");

  if (techStackItems.length > 0) {
    content += `## 🛠️ Tech Stack\n\n`;
    techStackItems.forEach((item) => {
      content += `${item}\n`;
    });
    content += `\n`;
  }

  // Installation Section
  if (hasInstallation) {
    content += `${state.installation}\n\n`;
  }

  // Environment Variables
  if (hasEnvVars) {
    content += `### Environment Variables\n\n`;
    content += `\`\`\`bash\n`;
    state.environmentVariables.forEach((v) => {
      content += `${v.name}=${v.value}\n`;
    });
    content += `\`\`\`\n\n`;
  }

  // Project Structure
  if (hasStructure) {
    content += `## 📁 Project Structure\n\n`;
    content += `\`\`\`\n`;
    content += `${state.projectStructure}\n`;
    content += `\`\`\`\n\n`;
  }

  // Author Section
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
