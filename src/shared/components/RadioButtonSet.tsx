import { cn } from "../utils/ClassNames";
import { Button, type ButtonVariant } from "./Button";

interface RadioButtonOption<T extends string> {
  value: T;
  label: React.ReactNode;
}

interface RadioButtonSetProps<T extends string> {
  options: [RadioButtonOption<T>, RadioButtonOption<T>];
  value: T | undefined;
  onChange: (value: T) => void;
  className?: string;
  buttonClassName?: string;
  buttonVariant?: ButtonVariant;
}

const selectedOverrides: Record<ButtonVariant, string> = {
  primary: "rounded-sm text-beck-beige",
  secondary: "rounded-sm text-beck-beige",
  "no-bg": "rounded-sm text-beck-beige",
  link: "rounded-sm text-beck-beige",
  base: "rounded-sm text-beck-beige",
};

const unselectedStyles: Record<ButtonVariant, string> = {
  primary:
    "text-xl rounded-sm px-4 py-2 border-2 border-northern-not-black text-northern-not-black bg-transparent hover:opacity-75",
  secondary:
    "text-md rounded-sm px-4 py-2 border-2 border-northern-not-black text-northern-not-black bg-transparent hover:opacity-75",
  "no-bg":
    "text-xs px-2 rounded-sm border-2 border-northern-not-black text-northern-not-black bg-transparent hover:opacity-75",
  link: "rounded-sm border-2 border-northern-not-black text-northern-not-black bg-transparent hover:opacity-75",
  base: "rounded-sm border-2 border-northern-not-black text-northern-not-black bg-transparent hover:opacity-75",
};

export const RadioButtonSet = <T extends string>({
  options,
  value,
  onChange,
  className,
  buttonClassName,
  buttonVariant = "primary",
}: RadioButtonSetProps<T>) => {
  return (
    <div className={cn("grid grid-cols-2 gap-2", className)}>
      {options.map((option) => {
        const isSelected = value === option.value;
        return (
          <Button
            key={option.value}
            variant={isSelected ? buttonVariant : "base"}
            onClick={() => onChange(option.value)}
            className={cn(
              isSelected
                ? selectedOverrides[buttonVariant]
                : unselectedStyles[buttonVariant],
              buttonClassName,
            )}
          >
            {option.label}
          </Button>
        );
      })}
    </div>
  );
};
