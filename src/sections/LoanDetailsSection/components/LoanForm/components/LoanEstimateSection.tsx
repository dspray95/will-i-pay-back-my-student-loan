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
  onReset: (fieldName: string) => void;
  onFieldChange: (fieldName: string) => void;
  isFieldEdited: (fieldName: string) => boolean;
}

export const LoanEstimatesSection: React.FC<LoanEstimatesSectionProps> = ({
  showPostgradSection,
  defaultValues,
  totalLoan,
  totalGrant,
  onReset,
  onFieldChange,
  isFieldEdited,
}) => {
  return (
    <div className="flex flex-col gap-3 pt-8">
      <div className="flex flex-col mb-4">
        <span className="text-2xl">LOAN AND GRANT ESTIMATES</span>
        <span>
          These are our predicted estimates for your student loans and grants.
          You can change these if they are inaccurate.
        </span>
      </div>

      <NumericField
        name="tutionFeeLoan"
        label="TUITION FEE LOAN"
        defaultValue={defaultValues?.tutionFeeLoan || 0}
        onReset={onReset}
        onChange={onFieldChange}
        isEdited={isFieldEdited("tutionFeeLoan")}
      />

      {showPostgradSection && (
        <NumericField
          name="mastersTutionFeeLoan"
          label="POSTGRADUATE TUITION FEE LOAN"
          defaultValue={defaultValues?.mastersTutionFeeLoan || 0}
          onReset={onReset}
          onChange={onFieldChange}
          isEdited={isFieldEdited("mastersTutionFeeLoan")}
        />
      )}

      <NumericField
        name="maintenanceLoan"
        label="MAINTENANCE LOAN"
        defaultValue={defaultValues?.maintenanceLoan || 0}
        onReset={onReset}
        onChange={onFieldChange}
        isEdited={isFieldEdited("maintenanceLoan")}
      />

      <NumericField
        name="maintenanceGrant"
        label="MAINTENANCE GRANT"
        defaultValue={defaultValues?.maintenanceGrant || 0}
        onReset={onReset}
        onChange={onFieldChange}
        isEdited={isFieldEdited("maintenanceGrant")}
      />

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
