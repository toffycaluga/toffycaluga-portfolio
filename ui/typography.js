// ui/typography.js
export const TYPO = {
  family: "monospace",
  size: {
    title: "32px",
    section: "25px",
    label: "20px",
    text: "20px",
    footer: "20px",
  },
  // Helpers para no repetir strings
  font(sizeKey) {
    return `${this.size[sizeKey]} ${this.family}`;
  },
};
