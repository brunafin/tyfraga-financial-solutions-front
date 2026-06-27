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
          'font-bold text-numeric',
          isGradient
            ? 'text-2xl text-white sm:text-3xl'
            : smallText
              ? 'text-base text-text/80 sm:text-lg'
              : alignCenter
                ? 'text-xl text-primary sm:text-2xl'
                : 'text-lg text-text/80 sm:text-xl',
        ].join(' ')}
      >
        {title}
      </h3>
      <p className={isGradient ? 'text-sm text-white/90 sm:text-base' : 'text-sm text-text/60 sm:text-base'}>{value}</p>
    </div>
  )
}

export default DashboardItem