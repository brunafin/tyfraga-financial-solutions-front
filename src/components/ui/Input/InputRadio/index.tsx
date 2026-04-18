import { Controller } from "react-hook-form";

type Option = {
    label: string;
    value: string | number;
};

type InputRadioProps = {
    label: string;
    name: string;
    control: any;
    options: Option[];
    errors?: any;
    inline?: boolean;
    disabled?: boolean;
};

const InputRadio = ({
    label,
    name,
    control,
    options,
    errors,
    inline = false,
    disabled = false,
}: InputRadioProps) => {
    return (
        <div className="flex flex-col gap-2">
            <span className={`${disabled ? "opacity-50" : ""}`}>{label}</span>

            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <div className={`flex flex-col gap-1 ${inline ? "flex-row gap-8" : ""} ${disabled ? "opacity-50" : ""}`}>
                        {options.map((option) => (
                            <label key={option.value} className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    value={option.value}
                                    checked={field.value === option.value}
                                    onChange={() => field.onChange(option.value)}
                                    className={`accent-primary disabled:cursor-not-allowed`}
                                    disabled={disabled}
                                />
                                {option.label}
                            </label>
                        ))}
                    </div>
                )}
            />

            {errors?.[name] && (
                <span className="text-red-500 text-sm">
                    {errors[name].message}
                </span>
            )}
        </div>
    );
};

export default InputRadio;