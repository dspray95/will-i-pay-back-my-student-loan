// Generic function to get the latest data for a given year from a Record of available years
export const getLatestDataForYear = <T>(
  year: number,
  data: Record<number, T>
): T => {
  // Get all available years and sort them in descending order
  const availableYears = Object.keys(data)
    .map(Number)
    .sort((a, b) => b - a);

  // Find the most recent year that is <= the given year
  for (const availableYear of availableYears) {
    if (year >= availableYear) {
      return data[availableYear];
    }
  }

  // If no suitable year found, return the earliest available data
  const earliestYear = Math.min(...availableYears);

  return data[earliestYear];
};
