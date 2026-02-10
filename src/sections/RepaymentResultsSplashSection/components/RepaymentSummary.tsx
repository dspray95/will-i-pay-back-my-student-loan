import { Font } from "../../../shared/components/Text";
import { formatMoney } from "../../../shared/utils/formatMoney";

export const RepaymentSummary: React.FC<{
  title?: string;
  totalPaid: number;
  amountForgiven: number;
  interestAccrued: number;
  willRepay: boolean;
  alignLeft?: boolean;
}> = ({
  title,
  totalPaid,
  amountForgiven,
  interestAccrued,
  willRepay,
  alignLeft,
}) => (
  <div
    className={`flex gap-2 flex-col text-sm ${alignLeft ? "items-start text-left" : "items-center text-center"}`}
  >
    {title && (
      <div className={alignLeft ? "w-full text-center" : ""}>
        <Font.H2>{title}</Font.H2>
      </div>
    )}
    <Font.Body>
      You'll repay{" "}
      <Font.CurrencyBody className="text-district-green">
        {formatMoney(totalPaid)}
      </Font.CurrencyBody>{" "}
      in total
    </Font.Body>
    {!willRepay && (
      <Font.Body>
        You will have{" "}
        <Font.CurrencyBody className="text-central-red">
          {formatMoney(amountForgiven)}
        </Font.CurrencyBody>{" "}
        forgiven.
      </Font.Body>
    )}
    <Font.Body>
      You'll accrue{" "}
      <Font.CurrencyBody className="text-central-red">
        {formatMoney(interestAccrued)}
      </Font.CurrencyBody>{" "}
      in interest over the repayment period.
    </Font.Body>
  </div>
);
