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
    <label className={`flex flex-col gap-1 ${disabled ? "opacity-50" : ""}`}>
      {label}

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
              className="border border-gray-400 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed"
            />
          );
        }}
      />

      {errors?.[name] && (
        <span className="text-red-500 text-sm">
          {errors[name].message}
        </span>
      )}
    </label>
  );
};

export default InputPercentage;