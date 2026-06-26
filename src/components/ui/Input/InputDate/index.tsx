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
        <label className={`flex w-full flex-col gap-2 ${disabled ? "opacity-50" : ""}`}>
            <span className="input-label">{label}</span>

            <input
                type="date"
                data-form-field
                disabled={disabled}
                {...register(name)}
                className="input-field"
            />

            {/* Exibição em formato brasileiro */}
            {value && (
                <span className="text-text/60 text-sm">
                    Data: {formatToBR(value)}
                </span>
            )}

            {errors?.[name] && (
                <span className="input-error">
                    {errors[name].message}
                </span>
            )}
        </label>
    );
};

export default InputDate;