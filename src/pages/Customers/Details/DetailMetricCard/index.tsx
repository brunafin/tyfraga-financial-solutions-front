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
      <p className="metric-label">{label}</p>
      <p className={`metric-value mt-1 ${valueClass}`}>{value}</p>
    </div>
  );
};

export default DetailMetricCard;
