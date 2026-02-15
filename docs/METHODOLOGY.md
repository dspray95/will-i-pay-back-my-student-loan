# Calculator Methodology

## Overview

This calculator estimates whether a UK student loan will be fully repaid or written off, based on projected income over the repayment period. It supports all current English, Welsh, Scottish, and Northern Irish undergraduate loan plans, as well as postgraduate (masters) loans.

## Loan Plans Supported

| Plan | Who | When | Write-off |
|------|-----|------|-----------|
| Plan 1 | England & Wales | Pre-2012 | 25 years |
| Plan 1 NI | Northern Ireland | All years | 25 years |
| Plan 2 | England 2012-2022, Wales 2012+ | 2012+ | 30 years |
| Plan 4 | Scotland | All years | 30 years |
| Plan 5 | England | 2023+ | 40 years |
| Postgraduate | England & Wales | 2016+ | 30 years |

Write-off periods are counted from the April after you leave your course.

## How the Graduation Balance Is Calculated

Loans are disbursed in three termly installments per academic year (roughly every 122, 121, and 122 days). Interest compounds daily on the running balance from the date of each disbursement.

**Interest rates during study:**

- **Plan 1 / Plan 1 NI / Plan 4:** The lower of RPI or Bank of England base rate + 1%.
- **Plan 2 / Postgraduate:** RPI + 3%.
- **Plan 5:** RPI only (no additional margin).

Historical rates are sourced from SLC publications. For future academic years beyond available data, the most recent published rate is carried forward.

## How Repayments Are Calculated

Repayment starts in the April after graduation. Each tax year (April to March):

1. **Repayment threshold** - If annual income is at or below the plan's threshold, no repayment is due.
2. **Repayment amount** - If income exceeds the threshold:
   - Undergraduate plans (1, 2, 4, 5): **9%** of income above the threshold.
   - Postgraduate loans: **6%** of income above the threshold.
3. **Monthly processing** - The annual repayment is divided into 12 equal monthly amounts. Each month:
   - Daily compound interest is applied using the actual number of days in that calendar month.
   - The monthly repayment is then deducted (capped at the remaining balance).
   - If the balance reaches zero, repayment stops.

## Interest Rates During Repayment

Interest rates are set by the SLC each September, based on the March RPI figure. The calculator models this mid-year rate change:

- **April to August:** Uses the rate from the previous September's SLC announcement.
- **September to March:** Uses the rate from the current September's SLC announcement.

### Plan-specific rates:

- **Plan 1 / Plan 1 NI / Plan 4 / Plan 5:** Flat rate (RPI-based, no income dependency).
- **Plan 2:** Progressive rate that varies with income:
  - Income at or below the repayment threshold: RPI only.
  - Income at or above the upper interest threshold: RPI + 3%.
  - Income between the two thresholds: Linear interpolation between RPI and RPI + 3%.
- **Postgraduate:** Flat rate at RPI + 3%.

The interest rate for Plan 2 is determined using the previous tax year's income, matching SLC's actual assessment process.

## Simultaneous Undergraduate and Postgraduate Loans

If you have both an undergraduate and a postgraduate loan, repayments are calculated independently:

- Each loan uses its own repayment threshold and rate (9% vs 6%).
- Both repayments are due simultaneously from the same income.
- Each loan has its own write-off period, counted from its respective graduation date.

This matches the official SLC rules where the two loan types are treated as separate obligations.

## User-Configurable Assumptions

Two key assumptions are exposed as user-configurable controls in the Assumptions panel:

### Salary growth rate (default: 3.0%)

Annual percentage increase applied to future income when using the "auto" income projection mode. This represents expected nominal salary growth, combining inflation and real wage growth. The UK long-term average sits around 3-4%.

### Projected inflation / RPI (default: 2.5%)

Long-term RPI forecast used to project loan interest rates for years beyond published SLC data. This drives future interest rates as follows:

- Plan 1 / Plan 1 NI / Plan 4 / Plan 5: RPI
- Plan 2: RPI to RPI + 3% (progressive, based on income)
- Postgraduate: RPI + 3%

The default of 2.5% is based on the Bank of England's 2% CPI target plus a ~0.5% historical RPI-CPI formula effect. The OBR's long-term forecast typically sits between 2.5% and 3.25%.

The gap between these two rates matters: if salary growth exceeds inflation, repayments become more affordable over time relative to the interest being charged.

## Future Year Projections

For years beyond available SLC data:

- **Repayment thresholds:** The most recent published threshold is carried forward (frozen).
- **Interest rates:** Fall back to the user-configured projected inflation (RPI) rate.

## Data Sources

All thresholds, interest rates, and forgiveness periods are sourced from:

- [gov.uk student loan repayment guidance](https://www.gov.uk/repaying-your-student-loan)
- [SLC interest rate announcements](https://www.gov.uk/government/collections/student-loans-interest-rates)
- [HMRC deduction tables](https://www.gov.uk/government/publications/sl3-student-loan-deduction-tables)

Data is stored in JSON configuration files and updated when new rates are announced.

## Known Simplifications

1. **Threshold freezing** - Future repayment thresholds are held constant at the most recent value. In reality, some thresholds are uprated annually (e.g., Plan 5 is fixed at 25,000 by policy, while Plan 2 rises with average earnings).
2. **Long-term RPI** - A single user-configurable forecast is used for all future interest rates. Actual rates will vary year to year.
3. **Plan 5 PMR cap** - Plan 5 interest is subject to a Prevailing Market Rate cap that can reduce the rate below RPI. This cap is not currently modelled (it is not active as of 2025/26).
4. **Income basis** - The calculator uses gross annual income. In practice, employed borrowers repay through PAYE based on each pay period's earnings, and self-employed borrowers repay via self-assessment. The annual result is equivalent.
5. **Voluntary overpayments** - Not modelled. Only the mandatory repayment amount is calculated.
6. **Salary sacrifice** - Not accounted for. Salary sacrifice arrangements reduce gross pay for SLC purposes, which would reduce repayments.
