import classNames from "classnames";
import { PageHeader } from "./components/PageHeader";
import { LoanForm } from "./components/LoanForm";

export const LoanDetailsSection: React.FC<{
  isActive: boolean;
}> = ({ isActive }) => {
  return (
    <div
      className={classNames(
        "mx-2 flex flex-col justify-center",
        "transform transition-all  ease-in-out overflow-hidden",
        {
          "translate-x-0 duration-300": isActive,
          "-translate-x-[125%] duration-200": !isActive,
        }
      )}
    >
      <PageHeader />
      <h3>undergraduate</h3>
      <LoanForm />
    </div>
  );
};
