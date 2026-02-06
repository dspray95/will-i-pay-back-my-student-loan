import clsx from "clsx";

type ButtonVariant = "primary" | "secondary" | "no-bg";

interface ButtonProps {
  className?: string;
  disabled?: boolean;
  variant?: ButtonVariant;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  className,
  disabled = false,
  variant = "primary",
  type = "button",
  onClick,
  children,
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        // Base styles for all buttons
        "font-semibold  cursor-pointer transition-colors flex items-center justify-center gap-2",
        // Variant-specific styles
        {
          "text-xl text-semibold text-beck-beige rounded-sm px-4 py-2 border-none bg-piccadilly-blue hover:bg-piccadilly-blue-1 active:bg-piccadilly-blue-1":
            variant === "primary",
          "text-md px-4 py-2 rounded-md border-none text-northern-not-black bg-district-green hover:bg-district-green-1 active:bg-district-green-1 active:text-not-white":
            variant === "secondary",
          "text-xs border-b border-northern-not-black px-2 bg-transparent hover:bg-transparent hover:opacity-80 active:text-not-white":
            variant === "no-bg",
        },
        // Disabled styles
        disabled && "disabled:opacity-50 disabled:cursor-not-allowed",
        // overrides
        className
      )}
    >
      {children}
    </button>
  );
};
