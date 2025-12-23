export type CalculationResults = {
  willRepayUndergraduateLoan: boolean;
  willRepayPostgraduateLoan: boolean;
  undergraduateRepayments: number[];
  postgraduateRepayments: number[];
  totalUndergraduateInterestAccrued: number;
  totalPostgraduateInterestAccrued: number;
  totalUndergraduateLoanAmount: number; // Includes repayments
  totalPostgraduateLoanAmount: number; // Includes repayments
  undergraduateAmountForgiven: number;
  postgraduateAmountForgiven: number;
  totalUndergraduateDebtPaid: number;
  totalPostgraduateDebtPaid: number;
};
