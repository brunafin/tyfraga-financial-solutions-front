import { useEffect, useRef, useState } from "react";
import { Controller } from "react-hook-form";
import { ChevronDown } from "lucide-react";

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
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <label className={`flex w-full flex-col gap-2 ${disabled ? "opacity-50" : ""}`}>
      <span className="input-label">{label}</span>

      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ field }) => {
          const selectedOption = options.find(
            (option) => String(option.value) === String(field.value),
          );
          const displayValue = selectedOption?.label || placeholder;
          const hasValue = field.value !== "" && field.value !== undefined;

          return (
            <div ref={containerRef} className="relative">
              <button
                type="button"
                data-form-field
                disabled={disabled}
                aria-expanded={open}
                aria-haspopup="listbox"
                onClick={() => !disabled && setOpen((current) => !current)}
                className={`input-field flex items-center justify-between gap-3 text-left ${
                  !hasValue ? "text-text/40" : ""
                } ${open ? "is-active" : ""}`}
              >
                <span className="truncate">{displayValue}</span>
                <ChevronDown
                  size={18}
                  className={`shrink-0 text-text/50 transition-transform ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </button>

              {open && (
                <ul
                  role="listbox"
                  className="absolute z-50 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-primary/15 bg-white py-2 shadow-lg"
                >
                  <li role="option" aria-selected={!hasValue}>
                    <button
                      type="button"
                      className="w-full px-4 py-3.5 text-left text-sm text-text/50 transition-colors hover:bg-primary/5"
                      onClick={() => {
                        field.onChange("");
                        setOpen(false);
                      }}
                    >
                      {placeholder}
                    </button>
                  </li>

                  {options.map((option) => {
                    const isSelected =
                      String(option.value) === String(field.value);

                    return (
                      <li
                        key={option.value}
                        role="option"
                        aria-selected={isSelected}
                      >
                        <button
                          type="button"
                          className={`w-full px-4 py-3.5 text-left text-base transition-colors hover:bg-primary/5 ${
                            isSelected
                              ? "bg-primary/10 font-medium text-primary"
                              : "text-text"
                          }`}
                          onClick={() => {
                            field.onChange(option.value);
                            setOpen(false);
                          }}
                        >
                          {option.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        }}
      />

      {errors?.[name] && (
        <span className="input-error">{errors[name].message}</span>
      )}
    </label>
  );
};

export default InputSelect;
