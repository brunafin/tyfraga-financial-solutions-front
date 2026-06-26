interface DetailMetricCardProps {
  label: string;
  value: string;
  accent?: "primary" | "tertiary";
}

const DetailMetricCard = ({
  label,
  value,
  accent = "primary",
}: DetailMetricCardProps) => {
  const valueClass =
    accent === "tertiary" ? "text-tertiary" : "text-primary";

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <p className="text-xs text-text/50">{label}</p>
      <p className={`mt-1 text-lg font-bold ${valueClass}`}>{value}</p>
    </div>
  );
};

export default DetailMetricCard;
