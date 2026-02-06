import { cn } from "../utils/ClassNames";

const styles = {
  h1: "text-3xl semibold text-piccadilly-blue",
  h2: "text-2xl text-piccadilly-blue",
  h3: "text-2xl tracking-tight text-northern-not-black",
  h4: "text-xl text-picadilly-blue",
  label: "font-semi-bold text-northern-not-black",
  body: "text-northern-not-black",
};

type TextProps = {
  children: React.ReactNode;
  className?: string;
  small?: boolean;
};

export const Font = {
  H1: ({ children, className }: TextProps) => {
    return <h1 className={cn(styles.h1, className)}>{children}</h1>;
  },
  H2: ({ children, className }: TextProps) => {
    return <h2 className={cn(styles.h2, className)}>{children}</h2>;
  },

  H3: ({ children, className }: TextProps) => {
    return <h3 className={cn(styles.h3, className)}>{children}</h3>;
  },

  H4: ({ children, className }: TextProps) => {
    return <h4 className={cn(styles.h4, className)}>{children}</h4>;
  },
  Label: ({ children, className }: TextProps) => {
    return <label className={cn(styles.label, className)}>{children}</label>;
  },
  Body: ({ children, className, small }: TextProps) => {
    const textSize = small ? "text-sm" : "text-base";
    return <p className={cn(styles.body, textSize, className)}>{children}</p>;
  },
};
