import { NavLink } from "react-router";
import { ChevronRight } from "lucide-react";
import formatCentsToRealBRL from "../../../../utils/formatCentsToRealBRL";
import { formatDateTimeBR } from "../../../../utils/formatDateTimetoBr";

const STATUS_BAR_CLASS = {
  paid: "bg-green-500",
  pending: "bg-primary",
  overdue: "bg-tertiary",
} as const;

interface LoanListItemProps {
  uuid: string;
  loanDate: string;
  loanValue: number;
  status: "paid" | "pending" | "overdue";
}

const LoanListItem = ({
  uuid,
  loanDate,
  loanValue,
  status,
}: LoanListItemProps) => {
  return (
    <li>
      <NavLink
        to={`/loans/${uuid}`}
        className="relative flex overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md"
      >
        <div
          className={`absolute top-3 bottom-3 left-0 w-1 rounded-full ${STATUS_BAR_CLASS[status]}`}
          aria-hidden
        />
        <div className="flex flex-1 items-center justify-between gap-3 p-4 pl-5">
          <div>
            <p className="text-sm text-text/50">
              {formatDateTimeBR(loanDate)}
            </p>
            <p className="font-bold text-primary">
              {formatCentsToRealBRL(loanValue)}
            </p>
          </div>
          <ChevronRight className="shrink-0 text-text/30" size={20} />
        </div>
      </NavLink>
    </li>
  );
};

export default LoanListItem;
