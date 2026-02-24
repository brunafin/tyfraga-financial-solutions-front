const formatToCurrencyBRL = (value: number): string | undefined => {
    if (!value) return;
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

export default formatToCurrencyBRL