import { Controller } from "react-hook-form";

type InputQuantityProps = {
  label: string;
  name: string;
  control: any;
  errors?: any;
  disabled?: boolean;
};

const InputQuantity = ({ label, name, control, errors, disabled }: InputQuantityProps) => {
  return (
    <label className={`flex flex-col gap-1 ${disabled ? "opacity-50" : ""}`}>
      {label}

      <Controller
        name={name}
        control={control}
        defaultValue={""}
        render={({ field }) => (
          <input
            type="text"
            disabled={disabled}
            inputMode="numeric"
            value={field.value ?? ""}
            onChange={(e) => {
              const onlyNumbers = e.target.value.replace(/\D/g, "");
              field.onChange(onlyNumbers === "" ? "" : Number(onlyNumbers));
            }}
            placeholder="0"
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

export default InputQuantity;