import { useEffect, useState } from "react";

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
    <div className="flex flex-col pb-4">
      <h1 className="text-heading-primary font-familty-mono">
        <span>{`will I repay my student loan`}</span>
        <span className="inline-block w-4 text-center">{punctuation}</span>
      </h1>
      <span className="w-full text-right text-xs text-text-muted">
        ...this is not financial advice
      </span>
    </div>
  );
};
