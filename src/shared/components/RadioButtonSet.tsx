import { cn } from "../utils/ClassNames";
import { Button } from "./Button";

interface RadioButtonOption<T extends string> {
  value: T;
  label: React.ReactNode;
}

interface RadioButtonSetProps<T extends string> {
  options: [RadioButtonOption<T>, RadioButtonOption<T>];
  value: T | undefined;
  onChange: (value: T) => void;
  className?: string;
}

export const RadioButtonSet = <T extends string>({
  options,
  value,
  onChange,
  className,
}: RadioButtonSetProps<T>) => {
  return (
    <div className={cn("grid grid-cols-2 gap-2", className)}>
      {options.map((option) => (
        <Button
          key={option.value}
          variant="base"
          onClick={() => onChange(option.value)}
          className={
            value === option.value
              ? "border-none bg-piccadilly-blue text-beck-beige rounded-sm p-3 hover:bg-piccadilly-blue-1"
              : "border-2 border-piccadilly-blue text-piccadilly-blue bg-transparent rounded-sm p-3 hover:opacity-75"
          }
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
};
