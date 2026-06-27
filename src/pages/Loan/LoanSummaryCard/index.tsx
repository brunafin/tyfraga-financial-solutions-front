import TaxBadge from "../../../components/ui/TaxBadge";
import formatCentsToRealBRL from "../../../utils/formatCentsToRealBRL";
import { formatDateTimeBR } from "../../../utils/formatDateTimetoBr";

interface LoanSummaryCardProps {
  loanDate: string;
  tax: number;
  originalValue: number;
  loanValue: number;
}

const formatValue = (value: number) =>
  formatCentsToRealBRL(value) ?? "R$ 0,00";

const LoanSummaryCard = ({
  loanDate,
  tax,
  originalValue,
  loanValue,
}: LoanSummaryCardProps) => {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="metric-label">Data do empréstimo</p>
          <p className="mt-1 text-sm font-semibold text-primary sm:text-base">
            {formatDateTimeBR(loanDate)}
          </p>
        </div>
        <TaxBadge tax={Number(tax.toFixed(2))} label="Taxa" />
      </div>

      <hr className="my-4 border-primary/10" />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="metric-label">Total Emprestado</p>
          <p className="metric-value mt-1">
            {formatValue(originalValue)}
          </p>
        </div>
        <div>
          <p className="metric-label">Total com juros</p>
          <p className="metric-value mt-1 text-tertiary">
            {formatValue(loanValue)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoanSummaryCard;
