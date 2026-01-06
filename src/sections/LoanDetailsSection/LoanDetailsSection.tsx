import { LoanForm } from "./components/LoanForm/LoanForm";
import clsx from "clsx";

export const LoanDetailsSection: React.FC<{
  isActive: boolean;
}> = ({ isActive }) => {
  return (
    <div
      className={clsx(
        "mx-2 flex flex-col items-center pb-8",
        "transform transition-all  ease-in-out overflow-hidden",
        {
          "translate-x-0 duration-300": isActive,
          "-translate-x-[125%] duration-200": !isActive,
        }
      )}
    >
      <LoanForm />
    </div>
  );
};
