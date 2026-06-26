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
        <div className="flex w-full flex-col gap-3">
            <span className={`input-label ${disabled ? "opacity-50" : ""}`}>{label}</span>

            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <div className={`flex flex-col gap-3 ${inline ? "sm:flex-row sm:gap-6" : ""} ${disabled ? "opacity-50" : ""}`}>
                        {options.map((option) => (
                            <label
                                key={option.value}
                                className="flex min-h-12 items-center gap-3 rounded-xl border border-primary/15 bg-white px-4 py-3 shadow-sm has-[:checked]:border-primary has-[:checked]:ring-2 has-[:checked]:ring-primary/15"
                            >
                                <input
                                    type="radio"
                                    value={option.value}
                                    checked={field.value === option.value}
                                    onChange={() => field.onChange(option.value)}
                                    className="h-5 w-5 accent-primary disabled:cursor-not-allowed"
                                    disabled={disabled}
                                />
                                <span className="text-base text-text">{option.label}</span>
                            </label>
                        ))}
                    </div>
                )}
            />

            {errors?.[name] && (
                <span className="input-error">
                    {errors[name].message}
                </span>
            )}
        </div>
    );
};

export default InputRadio;