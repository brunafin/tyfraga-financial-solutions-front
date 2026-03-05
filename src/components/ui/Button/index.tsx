interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: "primary" | "outline" | "outline_primary";
    size?: "full" | "auto";
}

const Button = ({ children, variant, size, className, ...props }: IButtonProps) => {
    const variants = {
        primary: `${size === 'full' ? 'w-full' : 'w-fit'} flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white font-bold rounded-md hover:bg-red-500 transition-colors disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-60`,
        outline_primary: `${size === 'full' ? 'w-full' : 'w-fit'} flex items-center justify-center gap-2 px-4 py-2 border border-red-600 bg-white text-red-600 font-bold rounded-md hover:bg-red-500 transition-colors disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-white disabled:cursor-not-allowed disabled:opacity-60`,
        outline: `${size === 'full' ? 'w-full' : 'w-fit'} flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 font-bold rounded-md hover:bg-gray-100 transition-colors disabled:border-gray-200 disabled:text-gray-400 disabled:hover:bg-white disabled:cursor-not-allowed disabled:opacity-60`
    }

    return (
        <button className={variants[variant || "primary"]} {...props}>
            {children}
        </button>
    )
}

export default Button
