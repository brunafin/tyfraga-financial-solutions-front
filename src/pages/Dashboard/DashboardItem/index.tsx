import formatToCurrencyBRL from "../../../utils/formatToCurrencyBRL";

interface DashboardItemProps {
    title: string;
    value: number;
}

const DashboardItem = ({title, value}: DashboardItemProps) => {
  return (
    <div className="p-4 bg-gray-50 rounded shadow">
      <h3 className="text-lg font-bold text-gray-800">{title}</h3>
      <p className="text-gray-700">{formatToCurrencyBRL(value)}</p>
    </div>
  )
}

export default DashboardItem