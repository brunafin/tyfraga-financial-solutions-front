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
  const isOverdue =
    !isPaid &&
    (() => {
      const due = new Date(dueDate);
      const today = new Date();
      due.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      return due < today;
    })();

  return (
    <li className="rounded-xl bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <p className="text-base font-bold text-primary sm:text-lg">
            Parcela {installmentRef}
          </p>
          {isPaid ? (
            <span className="inline-flex shrink-0 items-center rounded-full bg-green-100 px-3 py-0.5 text-xs font-medium text-green-800 sm:text-sm">
              Pago
            </span>
          ) : isOverdue ? (
            <span className="inline-flex shrink-0 items-center rounded-full bg-red-100 px-3 py-0.5 text-xs font-medium text-red-800 sm:text-sm">
              Vencido
            </span>
          ) : (
            <span className="inline-flex shrink-0 items-center rounded-full bg-primary/10 px-3 py-0.5 text-xs font-medium text-primary sm:text-sm">
              Não pago
            </span>
          )}
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
