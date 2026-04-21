const TaxBadge = ({ tax, taxByCustomer = false }: { tax: number, taxByCustomer?: boolean }) => {
    return (
        <span
            className={`px-3 py-1 text-white ${taxByCustomer ? 'bg-secondary' : 'bg-primary/80'} rounded-full font-bold text-sm`}
        >
            Taxa {taxByCustomer ? 'média' : 'padrão'} {' '}
            {tax}%
        </span>
    );
};

export default TaxBadge;