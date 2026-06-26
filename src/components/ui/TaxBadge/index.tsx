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
      className={`bg-gradient-brand flex min-h-10 items-center justify-center rounded-full px-5 py-2.5 text-center text-sm font-semibold text-white ${
        fullWidth ? "w-full" : "inline-flex w-fit"
      }`}
    >
      {label ? label : taxByCustomer ? "Taxa média" : "Taxa padrão"} {tax}%
    </span>
  );
};

export default TaxBadge;
