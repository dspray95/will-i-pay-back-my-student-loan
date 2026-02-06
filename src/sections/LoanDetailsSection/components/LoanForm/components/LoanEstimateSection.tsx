import { Font } from "../../../../../shared/components/Text";
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
        <Font.H3>LOAN AND GRANT ESTIMATES</Font.H3>
        <Font.Body>
          These are our predicted estimates for your student loans and grants.
          You can change these if they are inaccurate.
        </Font.Body>
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

      <div className="grid grid-cols-2 gap-1 pt-4 border-t border-northern-not-black/20">
        <Font.Label>TOTAL LOAN</Font.Label>
        <Font.Body className="font-semi-bold text-lg text-piccadilly-blue">
          £ {totalLoan.toLocaleString()}
        </Font.Body>
      </div>

      <div className=" grid grid-cols-2 gap-1">
        <Font.Label>TOTAL GRANT</Font.Label>
        <Font.Body className="font-semi-bold text-lg text-piccadilly-blue">
          £ {totalGrant.toLocaleString()} {totalGrant === 0 && " 😢"}
        </Font.Body>
      </div>
    </div>
  );
};
