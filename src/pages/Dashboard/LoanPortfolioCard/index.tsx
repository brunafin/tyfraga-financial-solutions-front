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
        <p className="mb-1 text-sm text-text/60">Lucro Estimado</p>
        <p className="text-3xl font-bold text-primary">{formatValue(estimatedProfit)}</p>
      </div>

      <hr className="my-4 border-primary/10" />

      <div className="flex gap-4">
        <div className="flex-1">
          <p className="mb-1 text-sm text-text/60">Principal</p>
          <p className="text-lg font-bold text-primary">R$ {formatValue(principal, false)}</p>
        </div>
        <div className="flex-1">
          <p className="mb-1 text-sm text-text/60">Total c/ Juros</p>
          <p className="text-lg font-bold text-primary">R$ {formatValue(totalWithInterest, false)}</p>
        </div>
      </div>
    </div>
  );
};

export default LoanPortfolioCard;
