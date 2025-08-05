export const calculateCompoundInterest = (
  principal: number,
  interestRate: number,
  timesCompoundedPerYear: number,
  timeInYears: number
): number => {
  // A = P * (1 + r/n)^(nt)
  const result =
    principal *
    Math.pow(
      1 + interestRate / 100 / timesCompoundedPerYear,
      timesCompoundedPerYear * timeInYears
    );

  return parseFloat(result.toFixed(2));
};
