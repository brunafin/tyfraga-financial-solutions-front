import { NavLink } from "react-router";
import { ChevronRight } from "lucide-react";
import { formatLoansCount } from "../../../utils/formatLoansCount";

const AVATAR_VARIANTS = [
  "bg-primary/12 text-primary",
  "bg-tertiary/12 text-tertiary",
  "bg-support/12 text-support",
] as const;

interface CustomerListItemProps {
  uuid: string;
  name: string;
  loansCount: number;
  index: number;
}

const CustomerListItem = ({
  uuid,
  name,
  loansCount,
  index,
}: CustomerListItemProps) => {
  const initial = name.trim().charAt(0).toUpperCase();
  const avatarClass = AVATAR_VARIANTS[index % AVATAR_VARIANTS.length];

  return (
    <li>
      <NavLink
        to={`/customers/${uuid}`}
        className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
      >
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg font-semibold ${avatarClass}`}
          aria-hidden
        >
          {initial}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-text">{name}</p>
          <p className="text-sm text-text/50">{formatLoansCount(loansCount)}</p>
        </div>
        <ChevronRight className="shrink-0 text-text/30" size={20} />
      </NavLink>
    </li>
  );
};

export default CustomerListItem;
