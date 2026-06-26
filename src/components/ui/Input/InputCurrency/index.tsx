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
    <label className={`flex w-full flex-col gap-2 ${disabled ? "opacity-50" : ""}`}>
      <span className="input-label">{label}</span>

      <Controller
        name={name}
        control={control}
        defaultValue={0}
        render={({ field }) => (
          <input
          type="text"
          inputMode="decimal"
          data-form-field
          disabled={disabled}
            value={formatBRL(field.value)}
            onChange={(e) => {
              const numbers = e.target.value.replace(/\D/g, "");
              field.onChange(Number(numbers));
            }}
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

export default InputCurrency;