import {
    calculatePMTFromDates,
    calculatePresentValueFromDates,
    type InstallmentCashFlow,
} from "./calculateBase";

const MAX_RATE = 1_000_000;
const BINARY_SEARCH_ITERATIONS = 100;

const findRateByPMT = (
    principal: number,
    targetPMT: number,
    loanDate: Date,
    paymentDates: Date[]
) => {
    const calcPMT = (rate: number) =>
        calculatePMTFromDates(principal, rate, loanDate, paymentDates);

    let low = 0;
    let high = 1;

    while (calcPMT(high) < targetPMT) {
        high *= 2;

        if (high > MAX_RATE) {
            throw new Error("Não foi possível encontrar uma taxa válida.");
        }
    }

    let rate = 0;

    for (let i = 0; i < BINARY_SEARCH_ITERATIONS; i++) {
        rate = (low + high) / 2;

        const pmt = calcPMT(rate);

        if (pmt > targetPMT) {
            high = rate;
        } else {
            low = rate;
        }
    }

    return rate;
};

const findRateByPresentValue = (
    principal: number,
    loanDate: Date,
    cashFlows: InstallmentCashFlow[]
) => {
    const calcPV = (rate: number) =>
        calculatePresentValueFromDates(rate, loanDate, cashFlows);

    const totalNominal = cashFlows.reduce((acc, item) => acc + item.value, 0);

    if (totalNominal < principal) {
        throw new Error(
            "Total das parcelas é menor que o valor emprestado."
        );
    }

    if (totalNominal === principal) {
        return 0;
    }

    let low = 0;
    let high = 1;

    while (calcPV(high) > principal) {
        high *= 2;

        if (high > MAX_RATE) {
            throw new Error("Não foi possível encontrar uma taxa válida.");
        }
    }

    let rate = 0;

    for (let i = 0; i < BINARY_SEARCH_ITERATIONS; i++) {
        rate = (low + high) / 2;

        const presentValue = calcPV(rate);

        if (presentValue > principal) {
            low = rate;
        } else {
            high = rate;
        }
    }

    return rate;
};

export const calculateByInstallment = (
    principal: number,
    installmentValue: number,
    loanDate: Date,
    paymentDates: Date[]
) => {
    const installments = paymentDates.length;
    const rate = findRateByPMT(
        principal,
        installmentValue,
        loanDate,
        paymentDates
    );

    const total = installmentValue * installments;
    const interest = total - principal;

    return {
        installments,
        installmentValue: Number(installmentValue.toFixed(2)),
        totalWithInterest: Number(total.toFixed(2)),
        totalInterest: Number(interest.toFixed(2)),
        monthlyRate: Number((rate * 100).toFixed(2)),
    };
};

export const calculateByVariableInstallments = (
    principal: number,
    loanDate: Date,
    cashFlows: InstallmentCashFlow[]
) => {
    const rate = findRateByPresentValue(principal, loanDate, cashFlows);

    const total = cashFlows.reduce((acc, item) => acc + item.value, 0);
    const interest = total - principal;

    return {
        installments: cashFlows.length,
        installmentValues: cashFlows.map((item) =>
            Number(item.value.toFixed(2))
        ),
        totalWithInterest: Number(total.toFixed(2)),
        totalInterest: Number(interest.toFixed(2)),
        monthlyRate: Number((rate * 100).toFixed(2)),
    };
};
