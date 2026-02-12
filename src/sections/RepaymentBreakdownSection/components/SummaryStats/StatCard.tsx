import { Font } from "../../../../shared/components/Text";

const TwoLineLabel: React.FC<{ text: string }> = ({ text }) => {
  const firstSpace = text.indexOf(" ");
  const line1 = text.slice(0, firstSpace);
  const line2 = text.slice(firstSpace + 1);
  return (
    <Font.H4 className="block tracking-widest text-center uppercase">
      {line1}
      <br />
      {line2}
    </Font.H4>
  );
};

export const StatCard: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div className="flex flex-col items-center justify-between gap-1 basis-[calc(50%-0.75rem)] md:basis-0 md:flex-1">
    <TwoLineLabel text={label} />
    <div className="w-full border-t border-northern-not-black pt-1 mt-auto">
      <Font.CurrencyBody className="block text-center text-xl text-district-green">
        {value}
      </Font.CurrencyBody>
    </div>
  </div>
);
