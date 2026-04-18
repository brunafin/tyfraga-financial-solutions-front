import { calculatePMTFromDates } from "./calculateBase";

export const calculateByInstallment = (
  principal: number,
  installmentValue: number,
  loanDate: Date,
  paymentDates: Date[]
) => {
  const installments = paymentDates.length;

  const calcPMT = (rate: number) =>
    calculatePMTFromDates(principal, rate, loanDate, paymentDates);

  let low = 0;
  let high = 1; // 100% a.m.
  let rate = 0;

  for (let i = 0; i < 100; i++) {
    rate = (low + high) / 2;

    const pmt = calcPMT(rate);

    if (pmt > installmentValue) {
      high = rate;
    } else {
      low = rate;
    }
  }

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