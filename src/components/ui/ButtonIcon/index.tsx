import type { ButtonHTMLAttributes } from "react";

type ButtonOnlyIconProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: React.ReactNode;
  label: string;
  variant?: "primary" | "destructive";
};

const IconButton = ({
  icon,
  label,
  variant = "primary",
  ...props
}: ButtonOnlyIconProps) => {
  const base =
    "inline-flex items-center justify-center rounded-md p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary:
      "text-primary hover:bg-primary/90 hover:text-white focus:ring-primary",
    destructive:
      "text-red-700 hover:bg-red-700 hover:text-white focus:ring-red-600",
  };

  return (
    <button
      type="button"
      aria-label={label}
      className={`${base} ${variants[variant]}`}
      {...props}
    >
      {icon}
    </button>
  );
};

export default IconButton;