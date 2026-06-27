const MS_PER_DAY = 86400000;

const normalizeDate = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate());

export type InstallmentCashFlow = {
    value: number;
    date: Date;
};

export const getDaysFromLoanDate = (loanDate: Date, paymentDate: Date) => {
    const baseDate = normalizeDate(loanDate);
    const d = normalizeDate(paymentDate);
    const days = (d.getTime() - baseDate.getTime()) / MS_PER_DAY;

    if (days <= 0) {
        throw new Error("Data de parcela inválida");
    }

    return days;
};

export const getDailyRate = (monthlyRate: number) =>
    Math.pow(1 + monthlyRate, 1 / 30) - 1;

export const calculatePresentValueFromDates = (
    monthlyRate: number,
    loanDate: Date,
    cashFlows: InstallmentCashFlow[]
) => {
    const dailyRate = getDailyRate(monthlyRate);

    return cashFlows.reduce((acc, { value, date }) => {
        const days = getDaysFromLoanDate(loanDate, date);

        return acc + value / Math.pow(1 + dailyRate, days);
    }, 0);
};

export const calculatePMTFromDates = (
    principal: number,
    monthlyRate: number,
    loanDate: Date,
    paymentDates: Date[]
) => {
    const dailyRate = getDailyRate(monthlyRate);
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