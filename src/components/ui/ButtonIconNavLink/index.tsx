import { NavLink } from "react-router";
import type { ComponentProps } from "react";

type Variant =
  | "primary"
  | "link_primary"
  | "outline_primary"
  | "secondary"
  | "link_secondary"
  | "outline_secondary"
  | "destructive";

type Size = "full" | "auto";

type ButtonNavLinkProps = Omit<ComponentProps<typeof NavLink>, "className"> & {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
};

const ButtonNavLink = ({
  children,
  variant = "primary",
  size = "auto",
  className = "",
  ...props
}: ButtonNavLinkProps) => {
  const classNamesBase = `${
    size === "full" ? "w-full" : "w-fit"
  } py-2 px-4 rounded-md cursor-pointer transition-colors`;

  const variants: Record<Variant, string> = {
    primary: `${classNamesBase} bg-primary text-white hover:bg-primary/95`,
    outline_primary: `${classNamesBase} border border-primary text-primary hover:bg-primary/95 hover:text-white`,
    link_primary: `${classNamesBase} underline text-primary hover:text-primary/95 hover:font-bold`,
    secondary: `${classNamesBase} bg-secondary text-white hover:bg-secondary/95`,
    outline_secondary: `${classNamesBase} border border-secondary text-secondary hover:bg-secondary/95 hover:text-white`,
    link_secondary: `${classNamesBase} underline text-secondary hover:text-secondary/95 hover:font-bold`,
    destructive: `${classNamesBase} bg-red-800 text-white hover:bg-red-600`,
  };

  return (
    <NavLink
      {...props}
      className={`${variants[variant]} ${className}`}
    >
      {children}
    </NavLink>
  );
};

export default ButtonNavLink;