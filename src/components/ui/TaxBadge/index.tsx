const TaxBadge = ({
  tax,
  label = "",
  taxByCustomer = false,
  fullWidth = false,
}: {
  tax: number;
  label?: string;
  taxByCustomer?: boolean;
  fullWidth?: boolean;
}) => {
  return (
    <span
      className={`bg-gradient-brand flex min-h-10 items-center justify-center rounded-full px-4 py-2 text-center text-xs font-semibold text-white sm:px-5 sm:py-2.5 sm:text-sm ${
        fullWidth ? "w-full" : "inline-flex w-fit"
      }`}
    >
      {label ? label : taxByCustomer ? "Taxa média" : "Taxa padrão"} {tax}%
    </span>
  );
};

export default TaxBadge;
