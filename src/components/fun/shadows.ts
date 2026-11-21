// Shared lighting for the fun widgets: one light source straight above the page,
// so shadows fall downward and grow with how far an object sits above the page.
// Each level pairs a tight contact shadow with a wide, faint ambient one.
// Keep in sync with the hand-written values in RecordSpinner.module.css and
// Keyboard.module.css.
const LEVELS = {
  // Thin things lying flat: palette, record sleeve, vinyl, small buttons
  low: ["0 1px 2px rgba(0, 0, 0, 0.2)", "0 2px 6px rgba(0, 0, 0, 0.12)"],
  // Chunkier objects: keyboard body, picture frame
  mid: ["0 2px 3px rgba(0, 0, 0, 0.2)", "0 6px 12px rgba(0, 0, 0, 0.15)"],
};

export const dropShadow = (level: keyof typeof LEVELS) =>
  LEVELS[level].map((shadow) => `drop-shadow(${shadow})`).join(" ");

export const boxShadow = (level: keyof typeof LEVELS) =>
  LEVELS[level].join(", ");

// Canvas only supports a single shadow, so the car (the tallest object) gets one
// combined shadow
export const CANVAS_HIGH_SHADOW = {
  color: "rgba(0, 0, 0, 0.3)",
  blur: 14,
  offsetX: 0,
  offsetY: 6,
};
