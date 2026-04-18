type InputDateProps = {
    label: string;
    name: string;
    register: any;
    errors?: any;
    watch?: any;
    disabled?: boolean;
};

const InputDate = ({ label, name, register, errors, watch, disabled }: InputDateProps) => {
    const value = watch?.(name);

    const formatToBR = (date?: string) => {
        if (!date) return "";
        return new Date(date).toLocaleDateString("pt-BR");
    };

    return (
        <label className={`flex flex-col gap-1 ${disabled ? "opacity-50" : ""}`}>
            {label}

            <input
                type="date"
                disabled={disabled}
                {...register(name)}
                className="border border-gray-400 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed"
            />

            {/* Exibição em formato brasileiro */}
            {value && (
                <span className="text-gray-500 text-sm">
                    Data: {formatToBR(value)}
                </span>
            )}

            {errors?.[name] && (
                <span className="text-red-500 text-sm">
                    {errors[name].message}
                </span>
            )}
        </label>
    );
};

export default InputDate;