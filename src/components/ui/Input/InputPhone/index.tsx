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
    <label className={`flex flex-col gap-1 ${disabled ? "opacity-50" : ""}`}>
      {label}

      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ field }) => (
          <input
            type="text"
            inputMode="numeric"
            disabled={disabled}
            value={formatPhone(field.value || "")} // 👈 aqui está a correção
            onChange={(e) => {
              const numbers = e.target.value.replace(/\D/g, "").slice(0, 11);
              field.onChange(numbers);
            }}
            placeholder="(11) 91234-5678"
            className="border border-gray-400 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed"
          />
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

export default InputPhone;