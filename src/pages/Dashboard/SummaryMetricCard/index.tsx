interface SummaryMetricCardProps {
  value: string;
  label: string;
  accent?: "green" | "red";
}

const accentColorClass = {
  green: "bg-green-500",
  red: "bg-tertiary",
} as const;

const SummaryMetricCard = ({ value, label, accent }: SummaryMetricCardProps) => {
  return (
    <div className="relative flex-1 overflow-hidden rounded-xl bg-white p-4 shadow">
      {accent && (
        <div className={`absolute top-3 bottom-3 left-0 w-1 rounded-full ${accentColorClass[accent]}`} />
      )}
      <div className={accent ? "pl-3" : undefined}>
        <p className="text-lg font-bold text-primary">{value}</p>
        <p className="text-sm text-text/60">{label}</p>
      </div>
    </div>
  );
};

export default SummaryMetricCard;
