import formatCentsToRealBRL from "../../utils/formatCentsToRealBRL";
import type { ITimelineItem } from "../../pages/Dashboard";

const timelineMarkerClass = {
  payment: {
    dot: "bg-green-500",
    text: "Entrada",
  },
  loan: {
    dot: "bg-primary",
    text: "Saída",
  },
} as const;

interface TimelineListProps {
  items: ITimelineItem[];
}

const TimelineList = ({ items }: TimelineListProps) => {
  return (
    <ol>
      {items.map((item, index) => {
        const marker = timelineMarkerClass[item.type];
        const isLast = index === items.length - 1;

        return (
          <li key={item.id} className="relative flex gap-4 pb-6 last:pb-0">
            <div className="relative flex w-4 shrink-0 flex-col items-center">
              <div
                className={`z-10 h-3 w-3 shrink-0 rounded-full ring-4 ring-light ${marker.dot}`}
                aria-hidden
              />
              {!isLast && (
                <div className="absolute top-3 bottom-0 w-px bg-primary/15" aria-hidden />
              )}
            </div>

            <div className="min-w-0 flex-1 pt-0.5">
              <div className="mb-1 flex items-center justify-between gap-3">
                <span className="text-xs tracking-wide text-primary">
                  {marker.text}
                </span>
                <p className="shrink-0 text-sm font-bold text-primary">
                  {formatCentsToRealBRL(item.amount, false)}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-text/70">
                <span>{new Date(item.date).toLocaleDateString()}</span>
                <span className="text-primary">{item.customerName}</span>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
};

export default TimelineList;
