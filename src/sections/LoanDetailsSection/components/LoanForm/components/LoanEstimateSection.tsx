import { NumericField } from "./NumericField";

interface LoanEstimatesSectionProps {
  showPostgradSection: boolean;
  defaultValues: {
    tutionFeeLoan: number;
    maintenanceLoan: number;
    maintenanceGrant: number;
    mastersTutionFeeLoan: number;
  } | null;
  totalLoan: number;
  totalGrant: number;
  onFieldChange: (fieldName: string) => void;
  onReset: (fieldName: string) => void;
}

export const LoanEstimatesSection: React.FC<LoanEstimatesSectionProps> = ({
  showPostgradSection,
  defaultValues,
  totalLoan,
  totalGrant,
  onFieldChange,
  onReset,
}) => {
  return (
    <div className="flex flex-col gap-3 pt-8">
      <div className="flex flex-col mb-4">
        <span className="text-2xl">LOAN AND GRAND ESTIMATES</span>
        <span>
          These are our predicted estimates for your student loans and grants.
          You can change these if they are innacurate.
        </span>
      </div>
      <div onChange={() => onFieldChange("tutionFeeLoan")}>
        <NumericField
          name="tutionFeeLoan"
          label="TUITION FEE LOAN"
          defaultValue={defaultValues?.tutionFeeLoan || 0}
          onReset={onReset}
        />
      </div>

      {showPostgradSection && (
        <div onChange={() => onFieldChange("mastersTutionFeeLoan")}>
          <NumericField
            name="mastersTutionFeeLoan"
            label="POSTGRADUATE TUATION FEE LOAN"
            isHidden={!showPostgradSection}
            defaultValue={defaultValues?.mastersTutionFeeLoan || 0}
            onReset={onReset}
          />
        </div>
      )}

      <div onChange={() => onFieldChange("maintenanceLoan")}>
        <NumericField
          name="maintenanceLoan"
          label="MAINTENANCE LOAN"
          defaultValue={defaultValues?.maintenanceLoan || 0}
          onReset={onReset}
        />
      </div>

      <div onChange={() => onFieldChange("maintenanceGrant")}>
        <NumericField
          name="maintenanceGrant"
          label="MAINTENANCE GRANT"
          defaultValue={defaultValues?.maintenanceGrant || 0}
          onReset={onReset}
        />
      </div>

      <div className="font-semi-bold grid grid-cols-2 gap-1 pt-4 border-t border-northern-not-black/20">
        <label className="font-bold">TOTAL LOAN</label>
        <h5 className="font-semi-bold text-piccadilly-blue">
          £ {totalLoan.toLocaleString()}
        </h5>
      </div>

      <div className="font-semi-bold grid grid-cols-2 gap-1">
        <label>TOTAL GRANT</label>
        <h5 className="font-semi-bold text-piccadilly-blue">
          £ {totalGrant.toLocaleString()} {totalGrant === 0 && " 😢"}
        </h5>
      </div>
    </div>
  );
};
