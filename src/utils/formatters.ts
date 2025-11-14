/**
 * Capitalizes the first letter of a string
 */
export const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/**
 * Formats percentage numbers
 */
export const formatPercent = (num: number) => `${num}%`;

/**
 * Truncates text to a given length
 */
export const truncate = (text: string, length: number) =>
  text.length > length ? text.slice(0, length) + "…" : text;
