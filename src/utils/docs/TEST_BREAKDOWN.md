A. Graduation Calculation (calculateLoanAtGraduation)

1. Interest-Free Plans:
	- Verifies Plan 4 (Scotland) stays at principal amount.

	- Verifies Plan 5 (New England) stays at principal amount.


2. Termly Disbursement Logic (The "Issue 1" Fix):
	- Checks that termly disbursement yields correct interest ranges (vs raw math).

	- Crucial: Verifies that calculating termly (Sept/Jan/Apr) results in less interest than calculating as a lump sum at the start of the year.

	- Checks scaling for 3-year vs 4-year courses.

	- Checks "High Inflation Year" (2022) vs "Low Rate Year" (2015) logic.


3. Postgraduate Loans:
	- Verifies Plan 3 (Masters) interest calculation for 1-year and 2-year courses.


4. Edge Cases:
	- Zero principal.

	- Tiny principal (£1).

	- Large principal (£100k).


5. Rate Changes:
	- Ensures logic picks up different rates for different academic years.


B. Repayment Calculation (calculateLoanAtRepayment)

1. Income Thresholds:
	- Below Threshold: Ensures £0 repayment if income < threshold.

	- Above Threshold: Verifies correct 9% (Plan 2) and 6% (Postgrad) calculations.


2. Loan Completion:
	- Paid Off: Ensures logic stops exactly when balance hits £0.

	- Overpayment Protection: Ensures you never repay more than the remaining balance (e.g., if you owe £500 but calculation says pay £1000, you only pay £500).


3. Negative Amortization:
	- Verifies balance grows if interest > repayments (typical for many graduates).


4. Sliding Scale Interest (Plan 2):
	- Verifies that higher earners get charged a higher interest rate (RPI+3%) compared to lower earners (RPI only).


5. Breakdown Data Integrity:
	- Verifies the yearByYearBreakdown array sums up correctly (Start + Interest - Repayment = End).

	- Ensures income data is passed through correctly.


6. Missing Data:
	- Handles years with missing income data (defaults to £0).


7. Plan Differences:
	- Compares Plan 2 vs Plan 5 (Plan 5 has a lower threshold -> higher repayments).


C. Monthly Repayment Logic

1. Monthly Processing: Confirms that interest and repayments interact 12 times a year, not once.

2. Mid-Year Payoff: Verifies that a high earner can finish the loan in, say, July, rather than paying for the full year.

3. Leap Years: Indirectly verifies 29-day calculation for Feb 2024.

4. Tax Year: Confirms the cycle runs April–March.

5. Plan 2 interest based on previous year income

D. Integration

1. Full Lifecycle: Tests the chain from Graduation Calc -> Repayment Calc.

2. Multi-Plan: Tests holding an Undergrad + Postgrad loan simultaneously.