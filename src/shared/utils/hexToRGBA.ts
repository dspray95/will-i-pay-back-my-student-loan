export const hexToRGBA = (hex: string, alpha: number): string => {
  if (hex.length === 4) {
    // If the hex is a shortcut, expand it out
    hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
  }

  const rChannel = parseInt(hex.slice(1, 3), 16);
  const gChannel = parseInt(hex.slice(3, 5), 16);
  const bChannel = parseInt(hex.slice(5, 7), 16);

  return `rgba(${rChannel}, ${gChannel}, ${bChannel}, ${alpha ?? 0.0})`;
};
