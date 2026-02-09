// ui/typography.js
export const TYPO = {
  family: "monospace",
  size: {
    title: "40px",
    section: "35px",
    label: "25px",
    text: "25px",
    footer: "20px",
  },
  // Helpers para no repetir strings
  font(sizeKey) {
    return `${this.size[sizeKey]} ${this.family}`;
  },
};
