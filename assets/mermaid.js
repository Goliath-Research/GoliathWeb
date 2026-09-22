import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";

mermaid.initialize({
  startOnLoad: true,
  theme: "base",
  securityLevel: "strict",
  themeVariables: {
    fontFamily: '"Source Sans 3", "Segoe UI", sans-serif',
    primaryColor: "#e7f2f1",
    primaryTextColor: "#1c2430",
    primaryBorderColor: "#0e5f5c",
    lineColor: "#0e5f5c",
    secondaryColor: "#f8efd8",
    tertiaryColor: "#fffcf7",
  },
  flowchart: { curve: "basis", htmlLabels: true },
});
