import { calculateCompoundInterest } from "./compountInterest";

test("compound interest calculation", () => {
  const result = calculateCompoundInterest(
    10000, // Principal amount (P),
    2.5, // Annual interest rate (r) in percentage,
    4, // Times compounded per year (n),
    5 // Time in years (t)
  );
  expect(result).toEqual(11327.08);

  const result2 = calculateCompoundInterest(
    1000, // Principal amount (P),
    2, // Annual interest rate (r) in percentage,
    4, // Times compounded per year (n),
    30 // Time in years (t)
  );
  expect(result2).toEqual(1819.4);

  const result3 = calculateCompoundInterest(
    100000, // Principal amount (P),
    0.5, // Annual interest rate (r) in percentage,
    1, // Times compounded per year (n),
    4 // Time in years (t)
  );
  expect(result3).toEqual(102015.05);
});
