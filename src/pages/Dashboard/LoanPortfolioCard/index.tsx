import formatCentsToRealBRL from "../../../utils/formatCentsToRealBRL";

interface LoanPortfolioCardProps {
  principal: number;
  totalWithInterest: number;
}

const formatValue = (value: number, showSymbol = true) =>
  formatCentsToRealBRL(value, showSymbol) ?? (showSymbol ? "R$ 0,00" : "0,00");

const LoanPortfolioCard = ({ principal, totalWithInterest }: LoanPortfolioCardProps) => {
  const estimatedProfit = totalWithInterest - principal;

  return (
    <div className="rounded-xl bg-white p-5 shadow">
      <div>
        <p className="metric-label mb-1">Lucro Estimado</p>
        <p className="metric-value-hero">{formatValue(estimatedProfit)}</p>
      </div>

      <hr className="my-4 border-primary/10" />

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <p className="metric-label mb-1">Principal</p>
          <p className="metric-value">R$ {formatValue(principal, false)}</p>
        </div>
        <div className="flex-1">
          <p className="metric-label mb-1">Total c/ Juros</p>
          <p className="metric-value">R$ {formatValue(totalWithInterest, false)}</p>
        </div>
      </div>
    </div>
  );
};

export default LoanPortfolioCard;
