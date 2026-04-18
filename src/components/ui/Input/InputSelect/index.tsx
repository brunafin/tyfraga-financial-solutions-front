import { Controller } from "react-hook-form";

type Option = {
  label: string;
  value: string | number;
};

type InputSelectProps = {
  label: string;
  name: string;
  control: any;
  options: Option[];
  placeholder?: string;
  errors?: any;
  disabled?: boolean;
};

const InputSelect = ({
  label,
  name,
  control,
  options,
  placeholder = "Selecione...",
  errors,
  disabled = false,
}: InputSelectProps) => {
  return (
    <label className={`flex flex-col gap-1 ${disabled ? "opacity-50" : ""}`}>
      {label}

      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ field }) => (
          <select
            {...field}
            disabled={disabled}
            className="border border-gray-400 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed"
          >
            {/* Placeholder funcional */}
            <option value="">
              {placeholder}
            </option>

            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      />

      {errors?.[name] && (
        <span className="text-red-500 text-sm">
          {errors[name].message}
        </span>
      )}
    </label>
  );
};

export default InputSelect;