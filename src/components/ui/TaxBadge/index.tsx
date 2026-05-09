const TaxBadge = ({ tax, label="", taxByCustomer = false }: { tax: number, label?: string; taxByCustomer?: boolean }) => {
    return (
        <span
            className={`px-3 py-1 text-white ${taxByCustomer ? 'bg-secondary' : 'bg-primary/80'} rounded-full font-bold text-sm`}
        >
            {label ? label : taxByCustomer ? 'Taxa média' : 'Taxa padrão'} {' '}
            {tax}%
        </span>
    );
};

export default TaxBadge;