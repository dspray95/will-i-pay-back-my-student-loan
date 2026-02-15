export const formatCurrency = (
  amount: number,
  { abbreviated }: { abbreviated?: boolean } = {},
) => {
  if (abbreviated && Math.abs(amount) >= 1000) {
    return `£${Math.round(amount / 1000)}k`;
  }
  return `£${amount.toLocaleString("en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};
