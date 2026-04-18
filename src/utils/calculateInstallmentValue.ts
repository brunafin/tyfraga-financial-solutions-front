import { calculatePMTFromDates } from "./calculateBase";

export const calculateByRate = (
  principal: number,
  monthlyRate: number, // ex: 0.2 = 20%
  loanDate: Date,
  paymentDates: Date[]
) => {
  const installments = paymentDates.length;

  console.log('tax', monthlyRate)

  const pmt = calculatePMTFromDates(
    principal,
    monthlyRate,
    loanDate,
    paymentDates
  );

  const total = pmt * installments;
  const interest = total - principal;

  return {
    installments,
    installmentValue: Number(pmt.toFixed(2)),
    totalWithInterest: Number(total.toFixed(2)),
    totalInterest: Number(interest.toFixed(2)),
    monthlyRate: Number((monthlyRate * 100).toFixed(2)),
  };
};