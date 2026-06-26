interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: "primary" | "link_primary" | "outline_primary" | "secondary" | "link_secondary" | "outline_secondary" | 'destructive';
    size?: "full" | "auto";
}

const Button = ({ children, variant, size, className = "", disabled, ...props }: IButtonProps) => {
    const sizeClasses = size === "full"
        ? "w-full min-h-12 rounded-xl px-4 py-3 text-base font-semibold"
        : "w-fit rounded-md px-4 py-2";

    const classNamesBase = `${sizeClasses} inline-flex items-center justify-center cursor-pointer transition-colors disabled:cursor-not-allowed disabled:opacity-50`;
    const variants = {
        primary: `${classNamesBase} bg-primary text-white hover:bg-primary/95 disabled:hover:bg-primary`,
        outline_primary: `${classNamesBase} border border-primary text-text hover:bg-primary/95 hover:text-white disabled:hover:bg-transparent disabled:hover:text-text`,
        link_primary: `${classNamesBase} min-h-0 rounded-none px-0 py-0 font-medium underline hover:font-semibold disabled:hover:font-medium`,
        secondary: `${classNamesBase} bg-secondary text-white hover:bg-secondary/95 disabled:hover:bg-secondary`,
        outline_secondary: `${classNamesBase} border border-secondary text-secondary hover:bg-secondary/95 hover:text-white disabled:hover:bg-transparent disabled:hover:text-secondary`,
        link_secondary: `${classNamesBase} min-h-0 rounded-none px-0 py-0 font-medium underline hover:font-semibold disabled:hover:font-medium`,
        destructive: `${classNamesBase} bg-red-800 text-white hover:bg-red-600 disabled:hover:bg-red-800`,
    }

    return (
        <button
            className={`${variants[variant || "primary"]} ${className}`}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    )
}

export default Button
