import { Font } from "../../shared/components/Text";

export const MethodologySection: React.FC = () => {
  return (
    <div className="flex gap-8 items-start justify-center py-12 flex-col max-w-4xl mx-auto px-6">
      <Font.H2 className="text-center w-full">METHODOLOGY</Font.H2>

      <div className="flex flex-col gap-6">
        <div>
          <Font.H3 className="mb-3">What this calculator does</Font.H3>
          <Font.Body>
            This calculator models your student loan repayment as closely as
            possible to how the Student Loans Company actually processes it.
            Interest is compounded daily from the moment each loan installment
            is disbursed, and repayments are calculated month-by-month against
            the correct thresholds and interest rates for your specific plan.
          </Font.Body>
        </div>

        <Font.Body>
          By providing your expected income year-by-year, the results reflect
          your actual career trajectory rather than a single assumed salary.
          Where official SLC rates and thresholds have been published, we use
          those directly. For future years, we fall back to configurable
          assumptions for inflation and salary growth.
        </Font.Body>

        <div>
          <Font.H3 className="mb-3">What we can't account for</Font.H3>
          <Font.Body>
            The accuracy of the results depends on how closely your income
            projection matches reality. A few things fall outside what the
            calculator can model:
          </Font.Body>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>
              <Font.Body>
                <strong>Career breaks or part-time work</strong> - periods of
                reduced or no income would lower your total repayments
              </Font.Body>
            </li>
            <li>
              <Font.Body>
                <strong>Future threshold changes</strong> - repayment thresholds
                are held at the most recently published values, though in
                practice some are uprated annually
              </Font.Body>
            </li>
            <li>
              <Font.Body>
                <strong>Voluntary overpayments</strong> - only mandatory
                repayments are modelled
              </Font.Body>
            </li>
            <li>
              <Font.Body>
                <strong>Salary sacrifice</strong> - arrangements like pension
                contributions reduce your gross pay for SLC purposes, which
                would lower repayments
              </Font.Body>
            </li>
          </ul>
        </div>

        <div>
          <Font.H3 className="mb-3">Data sources</Font.H3>
          <Font.Body>
            All thresholds, interest rates, and write-off periods are sourced
            from official government and SLC publications and updated when new
            rates are announced.
          </Font.Body>
        </div>

        <div className="mt-2 pt-6 border-t border-gray-200">
          <Font.Body>
            For the full technical methodology including interest rate formulas,
            plan-specific rules, and known simplifications, see the{" "}
            <a
              href="https://github.com/yourusername/will-i-pay-my-student-loan/blob/main/docs/METHODOLOGY.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              complete methodology document
            </a>
            .
          </Font.Body>
        </div>
      </div>
    </div>
  );
};
