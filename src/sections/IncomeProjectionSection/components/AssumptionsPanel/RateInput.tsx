import { clamp } from "../../../../shared/utils/maths";

export const RateInput: React.FC<{
  label: string;
  value: number;
  onChange: (value: number) => void;
  helpText: string;
}> = ({ label, value, onChange, helpText }) => {
  const rateStep = 0.5;
  const maxRate = 10;
  const minRate = 0;
  const precision = 10;

  const handleUpdate = (delta: number) => {
    const nextValue = Math.round((value + delta) * precision) / precision;
    onChange(clamp(nextValue, minRate, maxRate));
  };

  return (
    <div className="flex-1">
      <label className="text-sm font-semibold text-northern-not-black block mb-1">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => handleUpdate(-rateStep)}
          className="w-8 h-8 rounded-sm border border-piccadilly-blue/30 text-piccadilly-blue hover:bg-piccadilly-blue/10 cursor-pointer transition-colors flex items-center justify-center"
        >
          -
        </button>
        <span className="font-mono text-base font-semibold text-northern-not-black w-12 text-center">
          {value.toFixed(1)}%
        </span>
        <button
          type="button"
          onClick={() => handleUpdate(rateStep)}
          className="w-8 h-8 rounded-sm border border-piccadilly-blue/30 text-piccadilly-blue hover:bg-piccadilly-blue/10 cursor-pointer transition-colors flex items-center justify-center"
        >
          +
        </button>
      </div>
      <p className="text-xs text-northern-not-black/50 mt-1">{helpText}</p>
    </div>
  );
};
