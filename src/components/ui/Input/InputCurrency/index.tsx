import { Controller } from "react-hook-form";

type InputCurrencyProps = {
  label: string;
  name: string;
  control: any;
  errors?: any;
  disabled?: boolean;
};

const formatBRL = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format((value || 0) / 100);

const InputCurrency = ({ label, name, control, errors, disabled }: InputCurrencyProps) => {
  return (
    <label className={`flex flex-col gap-1 ${disabled ? "opacity-50" : ""}`}>
      {label}

      <Controller
        name={name}
        control={control}
        defaultValue={0}
        render={({ field }) => (
          <input
          type="text"
          disabled={disabled}
            value={formatBRL(field.value)}
            onChange={(e) => {
              const numbers = e.target.value.replace(/\D/g, "");
              field.onChange(Number(numbers));
            }}
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

export default InputCurrency;