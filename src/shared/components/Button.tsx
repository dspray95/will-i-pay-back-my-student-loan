import classNames from "classnames";

export const Button: React.FC<{
  className?: string;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "no-bg";
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  children: React.ReactNode;
}> = ({
  className: classNameOverride,
  disabled = false,
  variant = "primary",
  type = "button",
  onClick,
  children,
}) => {
  let builtinClassNames: string[];
  switch (variant) {
    case "primary":
      builtinClassNames = PRIMARY_BUTTON_CLASS;
      break;
    case "secondary":
      builtinClassNames = PRIMARY_BUTTON_CLASS;
      break;
    case "no-bg":
      builtinClassNames = NO_BG_BUTTON_CLASS;
      break;
    default:
      builtinClassNames = PRIMARY_BUTTON_CLASS;
      break;
  }
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={classNames(...builtinClassNames, classNameOverride)}
    >
      {children}
    </button>
  );
};

const PRIMARY_BUTTON_CLASS = [
  "text-md font-semibold text-northern-not-black bg-primary border-none px-4 py-2 rounded-md cursor-pointer",
  "hover:bg-primary-hover active:bg-primary-active disabled:bg-primary-disabled disabled:cursor-not-allowed",
];

const NO_BG_BUTTON_CLASS: string[] = [
  "text-xs font-semibold northern-not-black border-b border-secondary cursor-pointer px-2",
  "hover:!bg-transparent hover:northern-not-black-light",
];
// button {
//     font-size: 1rem; /* 16px */
//     font-weight: 600;
//     color: var(--color-northern-not-black);
//     background-color: var(--color-primary);
//     border: none;
//     padding: 0.5rem 1rem; /* 8px 16px */
//     border-radius: 0.375rem; /* 6px */
//     cursor: pointer;

//   }
