export const buildGoogleMapsSearchUrl = (query: string) => {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${query.trim()} cerca de ti`.trim(),
  )}`;
};
