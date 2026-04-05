import { useState } from "react";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { RepaymentBreakdown } from "../../../../shared/types";
import {
  colorCentralRed,
  colorDistrictGreen,
  colorNorthernNotBlack,
  colorNorthernNotBlackLight1,
  colorPiccadillyBlue,
} from "../../../../shared/constants/color";
import { Font } from "../../../../shared/components/Text";
import { formatCurrency } from "../../../../shared/utils/formatCurrency";
import { useIsMobile } from "../../../../shared/hooks/useIsMobile";
import { hexToRGBA } from "../../../../shared/utils/hexToRGBA";

export const RepaymentPlot: React.FC<{
  repaymentBreakdown: RepaymentBreakdown;
  courseLength: number;
  studyYearBalances?: Array<{ year: number; balance: number }>;
  studyYearRepayments?: Map<number, number>;
  title?: string;
  yDomain?: [number, number];
  compact?: boolean;
  containerHeight: number;
  alternateBreakdown?: RepaymentBreakdown;
  alternateStudyYearBalances?: Array<{ year: number; balance: number }>;
}> = ({
  repaymentBreakdown,
  courseLength,
  studyYearBalances,
  studyYearRepayments,
  title = "Repayments",
  yDomain,
  compact = false,
  containerHeight,
  alternateBreakdown,
  alternateStudyYearBalances,
}) => {
  const startYear = repaymentBreakdown[0].year - courseLength;
  const [hidden, setHidden] = useState<Record<string, boolean>>({});
  const isMobile = useIsMobile();

  const data: Array<{
    year: number;
    automaticRepayment: number;
    voluntaryRepayment: number;
    loanBalance: number;
    totalRepayments: number;
    alternateLoanBalance?: number | undefined;
  }> = [];

  // Build a lookup of the base (no voluntary repayments) repayment per year
  const alternateRepaymentByYear = new Map<number, number>(
    alternateBreakdown?.map(
      (entry) => [entry.year, entry.repayment] as const,
    ) ?? [],
  );

  // Course years — use study year balances if available
  const balanceByYear = new Map(
    studyYearBalances?.map((s) => [s.year, s.balance]),
  );

  // If we have an alternate repayment plan, we want to show that as well
  // as a comparison (used for comparing with voluntary repayments vs without)
  const alternateBalanceByYear = new Map<number, number>([
    ...(alternateStudyYearBalances?.map((s) => [s.year, s.balance] as const) ??
      []),
    ...(alternateBreakdown?.map(
      (entry) => [entry.year, entry.endingBalance] as const,
    ) ?? []),
  ]);

  let runningStudyRepayments = 0;
  for (let year = startYear; year < repaymentBreakdown[0].year; year++) {
    const yearRepayment = studyYearRepayments?.get(year) ?? 0;
    runningStudyRepayments += yearRepayment;
    data.push({
      year,
      automaticRepayment: 0,
      voluntaryRepayment: yearRepayment,
      loanBalance:
        balanceByYear.get(year) ?? repaymentBreakdown[0].startingBalance,
      totalRepayments: runningStudyRepayments,
      alternateLoanBalance: alternateBalanceByYear?.get(year),
    });
  }

  // Repayment years
  let runningTotal = runningStudyRepayments;
  const lastPrimaryYear =
    repaymentBreakdown[repaymentBreakdown.length - 1].year;
  const lastAlternateYear = alternateBreakdown
    ? alternateBreakdown[alternateBreakdown.length - 1].year
    : lastPrimaryYear;
  const lastYear = Math.max(lastPrimaryYear, lastAlternateYear);

  for (const entry of repaymentBreakdown) {
    runningTotal += entry.repayment;
    const automatic =
      alternateRepaymentByYear.get(entry.year) ?? entry.repayment;
    const voluntary = Math.max(0, entry.repayment - automatic);
    data.push({
      year: entry.year,
      automaticRepayment: automatic,
      voluntaryRepayment: voluntary,
      loanBalance: entry.endingBalance,
      totalRepayments: runningTotal,
      alternateLoanBalance: alternateBalanceByYear?.get(entry.year),
    });
  }

  // Extend data if alternate breakdown goes beyond primary
  for (let year = lastPrimaryYear + 1; year <= lastYear; year++) {
    data.push({
      year,
      automaticRepayment: 0,
      voluntaryRepayment: 0,
      loanBalance: 0,
      totalRepayments: runningTotal,
      alternateLoanBalance: alternateBalanceByYear?.get(year),
    });
  }

  // Show a "Loan Repaid" reference line if voluntary repayments pay off the
  // loan earlier than the alternate scenario
  const loanRepaidEarly =
    alternateBreakdown && lastPrimaryYear < lastAlternateYear;

  // Show a "Loan Written Off" reference line at the end of the repayment
  // period if the loan isn't fully repaid
  const lastPrimaryEntry = repaymentBreakdown[repaymentBreakdown.length - 1];
  const lastAlternateEntry =
    alternateBreakdown?.[alternateBreakdown.length - 1];
  const primaryWrittenOff = lastPrimaryEntry.endingBalance > 0;
  const alternateWrittenOff =
    lastAlternateEntry && lastAlternateEntry.endingBalance > 0;
  const writtenOffYear = primaryWrittenOff
    ? lastPrimaryYear
    : alternateWrittenOff
      ? lastAlternateYear
      : undefined;

  const handleLegendClick = (dataKey: string) => {
    setHidden((prev) => ({ ...prev, [dataKey]: !prev[dataKey] }));
  };

  const small = isMobile || compact;
  const dotSize = small ? 3 : 5;
  const strokeWidth = small ? 2 : 2.5;
  const tickFontSize = small ? 11 : 14;
  const showAxisLabels = !small;

  return (
    <div className="flex flex-col items-center gap-4">
      {title && <Font.H4>{title}</Font.H4>}
      <ResponsiveContainer width="100%" height={containerHeight}>
        <ComposedChart
          data={data}
          margin={
            small
              ? { left: 5, right: 5, top: 20, bottom: 5 }
              : { left: 60, right: 20, top: 25, bottom: 30 }
          }
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.2)" />
          <XAxis
            dataKey="year"
            stroke={colorNorthernNotBlackLight1}
            tick={{ fill: colorNorthernNotBlack, fontSize: tickFontSize }}
            label={
              showAxisLabels
                ? {
                    value: "Year",
                    position: "insideBottom",
                    offset: -15,
                    fill: colorNorthernNotBlack,
                  }
                : undefined
            }
          />
          <YAxis
            stroke={colorNorthernNotBlackLight1}
            tick={{ fill: colorNorthernNotBlack, fontSize: tickFontSize }}
            tickFormatter={(v: number) =>
              formatCurrency(v, { abbreviated: true })
            }
            width={small ? 55 : 80}
            domain={yDomain}
            label={
              showAxisLabels
                ? {
                    value: "Amount (£)",
                    angle: -90,
                    position: "insideLeft",
                    offset: 0,
                    fill: colorNorthernNotBlack,
                  }
                : undefined
            }
          />
          <Tooltip
            formatter={(value) => formatCurrency(Number(value))}
            contentStyle={{
              color: colorNorthernNotBlack,
            }}
            labelStyle={{ color: colorNorthernNotBlack }}
          />
          <Legend
            wrapperStyle={{
              color: colorNorthernNotBlack,
              paddingTop: small ? 10 : 20,
              fontSize: small ? 12 : 14,
            }}
            onClick={(e) => handleLegendClick(e.dataKey as string)}
            formatter={(value, entry) => (
              <span
                style={{
                  color: hidden[(entry as { dataKey?: string }).dataKey ?? ""]
                    ? "#999"
                    : colorNorthernNotBlack,
                  textDecoration: hidden[
                    (entry as { dataKey?: string }).dataKey ?? ""
                  ]
                    ? "line-through"
                    : "none",
                  cursor: "pointer",
                }}
              >
                {value}
              </span>
            )}
          />
          <ReferenceLine
            x={repaymentBreakdown[0].year}
            stroke={hexToRGBA(colorNorthernNotBlack, 0.5)}
            strokeDasharray="6 4"
            label={{
              value: "Repayments Start",
              position: "top",
              fill: hexToRGBA(colorNorthernNotBlack, 0.5),
              fontSize: small ? 10 : 12,
            }}
          />
          {loanRepaidEarly && (
            <ReferenceLine
              x={lastPrimaryYear}
              stroke={hexToRGBA(colorDistrictGreen, 0.5)}
              strokeDasharray="6 4"
              label={{
                value: small
                  ? "Loan Repaid"
                  : "Loan Repaid (with Voluntary Repayments)",
                position: "top",
                fill: hexToRGBA(colorDistrictGreen, 0.5),
                fontSize: small ? 10 : 12,
              }}
            />
          )}
          {writtenOffYear && (
            <ReferenceLine
              x={writtenOffYear}
              stroke={hexToRGBA(colorNorthernNotBlack, 0.5)}
              strokeDasharray="6 4"
              label={{
                value: "Loan Written Off",
                position: "insideTopRight",
                fill: hexToRGBA(colorNorthernNotBlack, 0.5),
                fontSize: small ? 10 : 12,
              }}
            />
          )}
          <Bar
            dataKey="automaticRepayment"
            name={compact ? "Repayment" : "Automatic Repayment"}
            fill={colorPiccadillyBlue}
            opacity={0.8}
            stackId="repayment"
            hide={hidden.automaticRepayment}
          />
          <Bar
            dataKey="voluntaryRepayment"
            name="Voluntary Repayment"
            fill={hexToRGBA(colorPiccadillyBlue, 0.5)}
            stackId="repayment"
            hide={hidden.voluntaryRepayment}
          />
          <Line
            type="monotone"
            dataKey="alternateLoanBalance"
            name={
              compact
                ? "Balance (No Voluntary Repayments)"
                : "Remaining Balance (No Voluntary Repayments)"
            }
            stroke={hexToRGBA(colorCentralRed, 0.35)}
            strokeWidth={strokeWidth * 0.75}
            dot={{ r: dotSize * 0.5 }}
            hide={hidden.alternateLoanBalance}
          />
          <Line
            type="monotone"
            dataKey="loanBalance"
            name={compact ? "Balance" : "Remaining Balance"}
            stroke={colorCentralRed}
            strokeWidth={strokeWidth}
            dot={{ r: dotSize }}
            hide={hidden.loanBalance}
          />
          <Line
            type="monotone"
            dataKey="totalRepayments"
            name={compact ? "Repaid" : "Total Repaid"}
            stroke={colorDistrictGreen}
            strokeWidth={strokeWidth}
            dot={{ r: dotSize }}
            hide={hidden.totalRepayments}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
