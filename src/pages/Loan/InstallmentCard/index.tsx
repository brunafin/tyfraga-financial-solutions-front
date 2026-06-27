import { Calendar, CalendarCheck } from "lucide-react";
import Button from "../../../components/ui/Button";
import formatCentsToRealBRL from "../../../utils/formatCentsToRealBRL";
import { formatDateTimeBR } from "../../../utils/formatDateTimetoBr";

interface InstallmentCardProps {
  installmentRef: number;
  installmentValue: number;
  dueDate: string;
  payedDate: string | null;
  observation: string | null;
  onMarkAsPaid: () => void;
}

const InstallmentCard = ({
  installmentRef,
  installmentValue,
  dueDate,
  payedDate,
  observation,
  onMarkAsPaid,
}: InstallmentCardProps) => {
  const isPaid = !!payedDate;

  return (
    <li className="rounded-xl bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-base font-bold text-primary sm:text-lg">Parcela {installmentRef}</p>
          <span
            className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium sm:text-sm ${
              isPaid
                ? "bg-green-100 text-green-800"
                : "bg-tertiary/15 text-tertiary"
            }`}
          >
            {isPaid ? "Pago" : "Não pago"}
          </span>
        </div>
        <p className="shrink-0 text-base font-bold text-primary text-numeric sm:text-lg">
          {formatCentsToRealBRL(installmentValue)}
        </p>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2 sm:text-base">
        <div className="flex items-start gap-2">
          <Calendar
            size={16}
            className="mt-0.5 shrink-0 text-text/40"
            aria-hidden
          />
          <div>
            <p className="metric-label">Vencimento</p>
            <p className="text-text/80">{formatDateTimeBR(dueDate)}</p>
          </div>
        </div>

        {isPaid && payedDate && (
          <div className="flex items-start gap-2">
            <CalendarCheck
              size={16}
              className="mt-0.5 shrink-0 text-text/40"
              aria-hidden
            />
            <div>
              <p className="metric-label">Pagamento</p>
              <p className="text-text/80">{formatDateTimeBR(payedDate)}</p>
            </div>
          </div>
        )}
      </div>

      {observation && (
        <p className="mb-4 text-sm text-text/60 sm:text-base">Observação: {observation}</p>
      )}

      {!isPaid && (
        <Button variant="outline_primary" size="full" onClick={onMarkAsPaid}>
          Marcar como pago
        </Button>
      )}
    </li>
  );
};

export default InstallmentCard;
