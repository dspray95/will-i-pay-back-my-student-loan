import { Font } from "../../../shared/components/Text";
import { formatCurrency } from "../../../shared/utils/formatCurrency";

export const RepaymentSummary: React.FC<{
  title?: string;
  totalPaid: number;
  amountForgiven: number;
  interestAccrued: number;
  willRepay: boolean;
  alignLeft?: boolean;
  useFirstPerson?: boolean;
}> = ({
  title,
  totalPaid,
  amountForgiven,
  interestAccrued,
  willRepay,
  alignLeft,
  useFirstPerson,
}) => (
  <div
    className={`flex gap-2 flex-col text-sm ${alignLeft ? "items-center md:items-start text-center md:text-left" : "items-center text-center"}`}
  >
    {title && (
      <div className={alignLeft ? "w-full text-center" : ""}>
        <Font.H2>{title}</Font.H2>
      </div>
    )}
    <Font.Body>
      {useFirstPerson ? "I'll " : "You'll "} repay{" "}
      <Font.CurrencyBody className="text-district-green">
        {formatCurrency(totalPaid)}
      </Font.CurrencyBody>{" "}
      in total
    </Font.Body>
    {!willRepay && (
      <Font.Body>
        {useFirstPerson ? "I " : "You "} will have{" "}
        <Font.CurrencyBody className="text-central-red">
          {formatCurrency(amountForgiven)}
        </Font.CurrencyBody>{" "}
        forgiven.
      </Font.Body>
    )}
    <Font.Body>
      {useFirstPerson ? "I'll " : "You'll "} accrue{" "}
      <Font.CurrencyBody className="text-central-red">
        {formatCurrency(interestAccrued)}
      </Font.CurrencyBody>{" "}
      in interest over the repayment period.
    </Font.Body>
  </div>
);
