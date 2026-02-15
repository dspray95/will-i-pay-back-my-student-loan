import { LoanForm } from "./components/LoanForm/LoanForm";

export const LoanDetailsSection: React.FC = () => {
  return (
    <div className="mx-2 flex flex-col items-center pb-8 border-b border-northern-not-black/20">
      <LoanForm />
    </div>
  );
};
