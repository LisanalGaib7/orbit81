// Generate a 2-letter prefix from a label
export function generatePrefix(label: string): string {
  if (!label) return "XX";
  const clean = label.replace(/[^a-zA-Z]/g, "").toUpperCase();
  return clean.slice(0, 2).padEnd(2, "X");
}

// Generate a full ID like "HE-01"
export function generateActionId(label: string, actionIndex: number): string {
  return `${generatePrefix(label)}-${String(actionIndex + 1).padStart(2, "0")}`;
}

// Default category prefixes for the 8 default sub-goals
export const DEFAULT_PREFIXES: Record<string, string> = {
  Health: "HE",
  Career: "CA",
  Finance: "FI",
  Learning: "LE",
  Relationships: "RE",
  Creativity: "CR",
  Mindfulness: "MI",
  Adventure: "AD",
};

export function getPrefix(label: string): string {
  return DEFAULT_PREFIXES[label] || generatePrefix(label);
}
