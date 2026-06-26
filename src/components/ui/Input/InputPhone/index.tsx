import { Controller } from "react-hook-form";

type InputPhoneProps = {
  label: string;
  name: string;
  control: any;
  errors?: any;
  disabled?: boolean;
};

const formatPhone = (value: string) => {
  const numbers = value.replace(/\D/g, "");

  if (numbers.length <= 10) {
    return numbers
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }

  return numbers
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
};

const InputPhone = ({
  label,
  name,
  control,
  errors,
  disabled = false,
}: InputPhoneProps) => {
  return (
    <label className={`flex w-full flex-col gap-2 ${disabled ? "opacity-50" : ""}`}>
      <span className="input-label">{label}</span>

      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ field }) => (
          <input
            type="text"
            inputMode="numeric"
            data-form-field
            disabled={disabled}
            value={formatPhone(field.value || "")}
            onChange={(e) => {
              const numbers = e.target.value.replace(/\D/g, "").slice(0, 11);
              field.onChange(numbers);
            }}
            placeholder="(51) 91234-5678"
            className="input-field"
          />
        )}
      />

      {errors?.[name] && (
        <span className="input-error">
          {errors[name].message}
        </span>
      )}
    </label>
  );
};

export default InputPhone;