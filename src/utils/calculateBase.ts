const MS_PER_DAY = 86400000;

const normalizeDate = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate());

export const calculatePMTFromDates = (
    principal: number,
    monthlyRate: number,
    loanDate: Date,
    paymentDates: Date[]
) => {
    const dailyRate = Math.pow(1 + monthlyRate, 1 / 30) - 1;

    const baseDate = normalizeDate(loanDate);

    const sumFactors = paymentDates.reduce((acc, date) => {
        const d = normalizeDate(date);

        const days = (d.getTime() - baseDate.getTime()) / MS_PER_DAY;

        if (days <= 0) {
            throw new Error("Data de parcela inválida");
        }

        return acc + 1 / Math.pow(1 + dailyRate, days);
    }, 0);

    return principal / sumFactors;
};