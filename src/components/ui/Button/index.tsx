interface IButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: "primary" | "outline" | "outline_primary";
    type?: "button" | "submit" | "reset";
    size?: "full" | "auto";
}

const Button  = ({ children, onClick, variant, type, size }: IButtonProps) => {
    const variants = {
        primary: `${size === 'full' ? 'w-full' : 'w-fit'} flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white font-bold rounded-md hover:bg-red-500 transition-colors`,
        outline_primary: `${size === 'full' ? 'w-full' : 'w-fit'} flex items-center justify-center gap-2 px-4 py-2 border border-red-600 bg-white text-red-600 font-bold rounded-md hover:bg-red-500 transition-colors`,
        outline: `${size === 'full' ? 'w-full' : 'w-fit'} flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 font-bold rounded-md hover:bg-gray-100 transition-colors`
    }
    return (
        <button type={type} onClick={onClick} className={variants[variant || "primary"]}>
            {children}
        </button>
    )
}

export default Button