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

export const RepaymentPlot: React.FC<{
  repaymentBreakdown: RepaymentBreakdown;
  courseLength: number;
  studyYearBalances?: Array<{ year: number; balance: number }>;
  title?: string;
  yDomain?: [number, number];
}> = ({
  repaymentBreakdown,
  courseLength,
  studyYearBalances,
  title = "Repayments",
  yDomain,
}) => {
  const startYear = repaymentBreakdown[0].year - courseLength;
  const [hidden, setHidden] = useState<Record<string, boolean>>({});

  const data: Array<{
    year: number;
    repayment: number;
    loanBalance: number;
    totalRepayments: number;
  }> = [];

  // Course years — use study year balances if available
  const balanceByYear = new Map(
    studyYearBalances?.map((s) => [s.year, s.balance]),
  );
  for (let year = startYear; year < repaymentBreakdown[0].year; year++) {
    data.push({
      year,
      repayment: 0,
      loanBalance:
        balanceByYear.get(year) ?? repaymentBreakdown[0].startingBalance,
      totalRepayments: 0,
    });
  }

  // Repayment years
  let runningTotal = 0;
  for (const entry of repaymentBreakdown) {
    runningTotal += entry.repayment;
    data.push({
      year: entry.year,
      repayment: entry.repayment,
      loanBalance: entry.endingBalance,
      totalRepayments: runningTotal,
    });
  }

  const handleLegendClick = (dataKey: string) => {
    setHidden((prev) => ({ ...prev, [dataKey]: !prev[dataKey] }));
  };

  const dotSize = 5;
  const strokeWidth = 2.5;

  return (
    <div className="flex flex-col items-center gap-4">
      {title && <Font.H4>{title}</Font.H4>}
      <ResponsiveContainer width="100%" height={500}>
        <ComposedChart
          data={data}
          margin={{ left: 60, right: 20, top: 25, bottom: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.2)" />
          <XAxis
            dataKey="year"
            stroke={colorNorthernNotBlackLight1}
            tick={{ fill: colorNorthernNotBlack }}
            label={{
              value: "Year",
              position: "insideBottom",
              offset: -15,
              fill: colorNorthernNotBlack,
            }}
          />
          <YAxis
            stroke={colorNorthernNotBlackLight1}
            tick={{ fill: colorNorthernNotBlack }}
            tickFormatter={(v: number) =>
              formatCurrency(v, { abbreviated: true })
            }
            width={80}
            domain={yDomain}
            label={{
              value: "Amount (£)",
              angle: -90,
              position: "insideLeft",
              offset: 0,
              fill: colorNorthernNotBlack,
            }}
          />
          <Tooltip
            formatter={(value) => formatCurrency(Number(value))}
            contentStyle={{
              color: colorNorthernNotBlack,
            }}
            labelStyle={{ color: colorNorthernNotBlack }}
          />
          <Legend
            wrapperStyle={{ color: colorNorthernNotBlack, paddingTop: 20 }}
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
            stroke={colorNorthernNotBlackLight1}
            strokeDasharray="6 4"
            label={{
              value: "Repayments start",
              position: "top",
              fill: colorNorthernNotBlack,
              fontSize: 12,
            }}
          />
          <Bar
            dataKey="repayment"
            name="Yearly Repayment"
            fill={colorPiccadillyBlue}
            opacity={0.8}
            hide={hidden.repayment}
          />
          <Line
            type="monotone"
            dataKey="loanBalance"
            name="Remaining Balance"
            stroke={colorCentralRed}
            strokeWidth={strokeWidth}
            dot={{ r: dotSize }}
            hide={hidden.loanBalance}
          />
          <Line
            type="monotone"
            dataKey="totalRepayments"
            name="Total Repaid"
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
