import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { Font } from "../../../shared/components/Text";
import { cn } from "../../../shared/utils/ClassNames";
import { handleNumberKeyDown } from "../../../shared/utils/handleNumberKeyDown";
import type { VoluntaryRepayment } from "../../../stores/slices/voluntaryRepaymentsSlice";

const FIELD_CLASS =
  "w-full text-northern-not-black border-2 rounded-sm border-northern-not-black bg-not-white p-2";

interface EarlyRepaymentInputProps {
  index: number;
  repayment: VoluntaryRepayment;
  minDate?: string;
  maxDate?: string;
  onUpdate: (index: number, updates: Partial<VoluntaryRepayment>) => void;
  onRemove: (index: number) => void;
  hasPostgradLoans?: boolean;
}

export const EarlyRepaymentInput: React.FC<EarlyRepaymentInputProps> = ({
  index,
  repayment,
  minDate,
  maxDate,
  onUpdate,
  onRemove,
  hasPostgradLoans = false,
}) => {
  const handleAmountChange = (raw: string) => {
    const parsed = parseInt(raw, 10);
    onUpdate(index, { amount: isNaN(parsed) ? 0 : parsed });
  };

  return (
    <div className="grid grid-cols-12 w-full gap-4">
      <div className="flex flex-col gap-1 col-span-2">
        <input
          type="date"
          className={cn(FIELD_CLASS, "cursor-pointer")}
          value={repayment.date}
          min={minDate}
          max={maxDate}
          onChange={(e) => onUpdate(index, { date: e.target.value })}
        />
      </div>
      {hasPostgradLoans && (
        <div className="col-span-2">
          <select
            className={cn(FIELD_CLASS, "cursor-pointer")}
            value={repayment.type ?? "undergraduate"}
            onChange={(e) =>
              onUpdate(index, {
                type: e.target.value as "postgraduate" | "undergraduate",
              })
            }
          >
            <option value="undergraduate">Undergrad</option>
            <option value="postgraduate">Postgrad</option>
          </select>
        </div>
      )}
      <div className={cn("flex flex-col gap-1", hasPostgradLoans ? "col-span-7" : "col-span-9")}>
        <div className="relative">
          <Font.Body className="absolute left-2 top-1/2 transform -translate-y-1/2">
            £
          </Font.Body>
          <input
            className={cn(FIELD_CLASS, "pl-6")}
            type="number"
            value={repayment.amount || ""}
            placeholder="0"
            onKeyDown={handleNumberKeyDown}
            onChange={(e) => handleAmountChange(e.target.value)}
          />
        </div>
      </div>
      <div className="flex items-center justify-center w-full h-full col-span-1">
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="text-central-red hover:text-central-red-1 cursor-pointer p-1"
          title="Remove repayment"
        >
          <FontAwesomeIcon icon={faTrash} size="sm" />
        </button>
      </div>
    </div>
  );
};
