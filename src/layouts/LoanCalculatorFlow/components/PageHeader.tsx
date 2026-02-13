import { useEffect, useState } from "react";
import { Font } from "../../../shared/components/Text";

export const PageHeader: React.FC<{ showExplainer?: boolean }> = ({
  showExplainer = true,
}) => {
  const [punctuation, setPunctuation] = useState("?");

  useEffect(() => {
    const timer = setTimeout(
      () => setPunctuation(punctuation === "?" ? "_" : "?"),
      500,
    );
    return () => clearTimeout(timer);
  }, [punctuation]);

  return (
    <div className="flex flex-col items-center justify-center gap-6 pb-10">
      <div className="max-w-full text-piccadilly-blue flex flex-col py-2 items-center w-fit px-30 justify-center border-2 border-piccadilly-blue">
        <span className="text-2xl text-nowrap -mb-3 md:mb-0">
          THE GREAT BRITISH
        </span>
        <Font.OutlineHeader>WRITE-OFF</Font.OutlineHeader>
      </div>
      <Font.H1 className="text-center">WILL I REPAY MY STUDENT LOAN?</Font.H1>
      {showExplainer && (
        <div className="flex flex-col gap-2 items-center justify-center">
          <Font.Body className="md:text-center">
            Estimate how much of your student loan you could end up repaying -
            and how much might get written off. Enter your loan details, map out
            your expected income year by year, and we'll do the maths.
          </Font.Body>
          <Font.Body className="md:text-center text-sm opacity-70">
            This tool does not constitute financial advice. Results are
            estimates based on current rules and may not account for future
            policy changes, variable interest rates, or individual
            circumstances.
          </Font.Body>
        </div>
      )}
    </div>
  );
};
