const formatCentsToRealBRL = (value: number, showSymbol = true): string | undefined => {
    if (!value) return;
    if (!showSymbol) {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value / 100).replace('R$', '').trim();
    }
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value / 100)
}

export default formatCentsToRealBRL