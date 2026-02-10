import { useEffect, useState } from "react";
import { Font } from "../../../shared/components/Text";

export const PageHeader: React.FC = () => {
  const [punctuation, setPunctuation] = useState("?");

  useEffect(() => {
    const timer = setTimeout(
      () => setPunctuation(punctuation === "?" ? "_" : "?"),
      500
    );
    return () => clearTimeout(timer);
  }, [punctuation]);

  return (
    <div className="flex flex-col items-center justify-center gap-10 pb-10">
      <div className="text-piccadilly-blue flex flex-col py-2 items-center w-fit px-30 justify-center border-2 border-piccadilly-blue">
        <span className="text-2xl">THE GREAT BRITISH</span>
        <Font.OutlineHeader>WRITE-OFF</Font.OutlineHeader>
      </div>
      <Font.H1>WILL I REPAY MY STUDENT LOAN?</Font.H1>
      <Font.Body>Small explainer about the calculator goes here!</Font.Body>
    </div>
  );
};
