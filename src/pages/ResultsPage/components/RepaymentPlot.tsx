import Plot from "react-plotly.js";
import type { RepaymentBreakdown } from "../../../types";

export const RepaymentPlot: React.FC<{
  undergraduateRepaymentBreakdown: RepaymentBreakdown;
  courseLength: number;
}> = ({ undergraduateRepaymentBreakdown, courseLength }) => {
  const startYear = undergraduateRepaymentBreakdown[0].year - courseLength - 1;

  let years: number[] = [];
  for (
    let year = startYear;
    year < undergraduateRepaymentBreakdown[0].year;
    year++
  ) {
    years.push(year);
  }
  years = years.concat(
    undergraduateRepaymentBreakdown.map((year) => year.year)
  );

  let repayments: number[] = [];
  for (let i = 0; i < courseLength; i++) {
    repayments.push(0);
  }
  repayments = repayments.concat(
    undergraduateRepaymentBreakdown.map((year) => year.repayment)
  );

  let repaymentsRunningTotal: number[] = [];
  for (let i = 0; i < undergraduateRepaymentBreakdown.length; i++) {
    const value = repaymentsRunningTotal[i - 1]
      ? repaymentsRunningTotal[i - 1]
      : 0;
    const runningTotal = value + undergraduateRepaymentBreakdown[i].repayment;
    repaymentsRunningTotal.push(runningTotal);
  }
  repaymentsRunningTotal = Array(courseLength)
    .fill(0)
    .concat(repaymentsRunningTotal);
  let loanBalance: number[] = [];
  for (let i = 0; i < courseLength; i++) {
    loanBalance.push(0);
  }
  loanBalance = loanBalance.concat(
    undergraduateRepaymentBreakdown.map((year) => year.endingBalance)
  );

  return (
    <Plot
      config={{ responsive: true }}
      data={[
        {
          x: years,
          y: repayments,
          type: "scatter",
          mode: "lines+markers",
          marker: { color: "red" },
          name: "Repayments Made",
        },
        {
          x: years,
          y: loanBalance,
          type: "scatter",
          mode: "lines+markers",
          marker: { color: "green" },
          name: "Loan Balance",
        },
        {
          x: years,
          y: repaymentsRunningTotal,
          type: "scatter",
          mode: "lines+markers",
          marker: { color: "blue" },
          name: "Total Repayments Made",
        },
      ]}
      layout={{
        width: 700,
        height: 500,
        title: { text: "Repayments" },
        paper_bgcolor: "rgba(0,0,0,0)", // Transparent background
        plot_bgcolor: "rgba(0,0,0,0)", // Transparent plot area
        font: {
          color: "#FFF", // Default text color for the entire plot
        },
        xaxis: {
          gridcolor: "rgba(255,255,255,0.2)", // Light grid lines
          tickfont: { color: "#FFF" }, // X-axis label color
          title: {
            text: "Year",
            font: { color: "#FFF" }, // X-axis title color
          },
        },
        yaxis: {
          gridcolor: "rgba(255,255,255,0.2)", // Light grid lines
          tickfont: { color: "#FFF" }, // Y-axis label color
          title: {
            text: "Amount (£)",
            font: { color: "#FFF" }, // Y-axis title color
          },
        },
        margin: {
          l: 50,
          r: 20,
          b: 50,
          t: 30,
        },
      }}
    />
  );
};
