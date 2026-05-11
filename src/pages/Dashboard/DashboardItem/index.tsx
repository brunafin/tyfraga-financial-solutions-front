interface DashboardItemProps {
    title: string;
    value: string | number;
    alignCenter?: boolean;
    smallText?: boolean;
}

const DashboardItem = ({title, value, alignCenter = false, smallText = false}: DashboardItemProps) => {
  return (
    <div className={`${alignCenter && 'text-center'} p-4 bg-gray-50 rounded shadow flex-1`}>
      <h3 className={`${smallText ? 'text-lg' : 'text-xl'} font-bold text-primary/80`}>{title}</h3>
      <p className="text-primary/70">{value}</p>
    </div>
  )
}

export default DashboardItem