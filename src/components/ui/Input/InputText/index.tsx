type InputTextProps = {
    label: string;
    name: string;
    placeholder?: string;
    register: any;
    errors?: any;
    disabled?: boolean;
};

const InputText = ({ label, placeholder, name, register, errors, disabled = false }: InputTextProps) => {
    return (
        <label className={`flex flex-col gap-1 ${disabled ? "opacity-50" : ""}`}>
            {label}

            <input
                {...register(name)}
                type="text"
                placeholder={placeholder}
                disabled={disabled}
                className={`border border-gray-400 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed`}
            />

            {errors?.[name] && (
                <span className="text-red-500 text-sm">
                    {errors[name].message}
                </span>
            )}
        </label>
    );
};

export default InputText;