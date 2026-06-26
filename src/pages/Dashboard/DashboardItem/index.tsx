interface DashboardItemProps {
    title: string;
    value: string | number;
    alignCenter?: boolean;
    smallText?: boolean;
    variant?: 'default' | 'gradient';
}

const DashboardItem = ({
    title,
    value,
    alignCenter = false,
    smallText = false,
    variant = 'default',
}: DashboardItemProps) => {
  const isGradient = variant === 'gradient';

  return (
    <div
      className={[
        'flex-1 rounded-xl p-4',
        alignCenter && 'text-center',
        isGradient
          ? 'bg-gradient-brand py-5 shadow-md'
          : 'bg-white shadow',
      ].filter(Boolean).join(' ')}
    >
      <h3
        className={[
          'font-bold',
          isGradient
            ? 'text-3xl text-white'
            : smallText
              ? 'text-lg text-text/80'
              : alignCenter
                ? 'text-2xl text-primary'
                : 'text-xl text-text/80',
        ].join(' ')}
      >
        {title}
      </h3>
      <p className={isGradient ? 'text-sm text-white/90' : 'text-text/60'}>{value}</p>
    </div>
  )
}

export default DashboardItem