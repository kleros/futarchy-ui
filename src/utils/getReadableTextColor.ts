/**
 * Returns a readable text color (black or white) for a given background color.
 *
 * Uses perceived luminance to determine whether the background is light or dark,
 * ensuring sufficient contrast for legibility.
 *
 * @param bgColor - Background color in hex format (`#RRGGBB`)
 * @returns `#000000` for light backgrounds, `#FFFFFF` for dark backgrounds
 */
export function getReadableTextColor(bgColor: string) {
  const hex = bgColor.replace("#", "");

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Perceived luminance formula: https://www.itu.int/dms_pubrec/itu-r/rec/bt/R-REC-BT.601-6-200701-S!!PDF-E.pdf
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.6 ? "#000000" : "#FFFFFF";
}
