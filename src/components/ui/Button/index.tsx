interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: "primary" | "link_primary" | "outline_primary" | "secondary" | "link_secondary" | "outline_secondary" | 'destructive';
    size?: "full" | "auto";
}

const Button = ({ children, variant, size, className, ...props }: IButtonProps) => {
const classNamesBase = `${size === 'full' ? 'w-full' : 'w-fit'} py-2 px-4 rounded-md cursor-pointer transition-colors`;
    const variants = {
        primary: `${classNamesBase} bg-primary text-white hover:bg-primary/95`,
        outline_primary: `${classNamesBase} border border-primary text-primary hover:bg-primary/95 hover:text-white`,
        link_primary: `${classNamesBase} underline text-primary hover:text-primary/95 hover:font-bold`,
        secondary: `${classNamesBase} bg-secondary text-white hover:bg-secondary/95`,
        outline_secondary: `${classNamesBase} border border-secondary text-secondary hover:bg-secondary/95 hover:text-white`,
        link_secondary: `${classNamesBase} underline text-secondary hover:text-secondary/95 hover:font-bold`,
        destructive: `${classNamesBase} bg-red-800 text-white hover:bg-red-600`,
    }

    return (
        <button className={variants[variant || "primary"]} {...props}>
            {children}
        </button>
    )
}

export default Button
