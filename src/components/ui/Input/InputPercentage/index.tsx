import { Controller } from "react-hook-form";
import { useEffect, useState } from "react";

type InputPercentageProps = {
  label: string;
  name: string;
  control: any;
  errors?: any;
  disabled?: boolean;
};

const InputPercentage = ({
  label,
  name,
  control,
  errors,
  disabled,
}: InputPercentageProps) => {
  const [displayValue, setDisplayValue] = useState("");

  return (
    <label className={`flex w-full flex-col gap-2 ${disabled ? "opacity-50" : ""}`}>
      <span className="input-label">{label}</span>

      <Controller
        name={name}
        control={control}
        defaultValue={0}
        render={({ field }) => {
          // 🔥 sincroniza RHF -> UI
          useEffect(() => {
            if (field.value !== undefined && field.value !== null) {
              setDisplayValue(
                String(field.value).replace(".", ",")
              );
            } else {
              setDisplayValue("");
            }
          }, [field.value]);

          return (
            <input
              type="text"
              inputMode="decimal"
              data-form-field
              disabled={disabled}
              value={displayValue}
              onChange={(e) => {
                let value = e.target.value;

                // só números e vírgula
                value = value.replace(/[^0-9,]/g, "");

                // evita mais de uma vírgula
                const parts = value.split(",");
                if (parts.length > 2) {
                  value = parts[0] + "," + parts.slice(1).join("");
                }

                setDisplayValue(value);

                const numeric = value.replace(",", ".");
                field.onChange(
                  numeric === "" ? "" : Number(numeric)
                );
              }}
              placeholder="0,00"
              className="input-field"
            />
          );
        }}
      />

      {errors?.[name] && (
        <span className="input-error">
          {errors[name].message}
        </span>
      )}
    </label>
  );
};

export default InputPercentage;