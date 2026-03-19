import React from "react";
import { Font } from "../../shared/components/Text";

export const VoluntaryRepaymentsSection: React.FC = () => {
  return (
    <div className="flex flex-col gap-2 items-center justify-center py-12">
      <div className="relative w-full flex flex-col items-center justify-center mb-4 text-center">
        <Font.H1>VOLUNTARY REPAYMENTS</Font.H1>
        <Font.Body className="text-left md:text-center my-2">
          Are you planning on making any voluntary repayments?
        </Font.Body>
      </div>
    </div>
  );
};
