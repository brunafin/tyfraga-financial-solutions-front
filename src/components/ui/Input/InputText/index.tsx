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
        <label className={`flex w-full flex-col gap-2 ${disabled ? "opacity-50" : ""}`}>
            <span className="input-label">{label}</span>

            <input
                {...register(name)}
                type="text"
                data-form-field
                placeholder={placeholder}
                disabled={disabled}
                className="input-field"
            />

            {errors?.[name] && (
                <span className="input-error">
                    {errors[name].message}
                </span>
            )}
        </label>
    );
};

export default InputText;