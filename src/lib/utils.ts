import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generates a pseudo-random, deterministic, visually appealing linear gradient from a string.
 * @param address The input string (e.g., wallet address).
 * @returns A CSS linear-gradient string.
 */
export const generateGradientFromAddress = (address: string): string => {
  if (!address) {
    return "linear-gradient(to right, #888, #555)";
  }

  // Simple hash function to get a numeric value from the address
  let hash = 0;
  for (let i = 0; i < address.length; i++) {
    const char = address.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }

  // Generate two distinct hue values from the hash
  const h1 = Math.abs(hash) % 360;
  // Ensure the second hue is different enough for a nice gradient
  const h2 = (h1 + 90 + (Math.abs(hash >> 8) % 180)) % 360;

  // Use fixed saturation and lightness for a consistent, modern look
  const s = 60; // Saturation
  const l1 = 35; // Lightness for the first color
  const l2 = 25; // Lightness for the second color

  const angle = Math.abs(hash >> 16) % 360;

  return `linear-gradient(${angle}deg, hsl(${h1}, ${s}%, ${l1}%), hsl(${h2}, ${s}%, ${l2}%))`;
};
