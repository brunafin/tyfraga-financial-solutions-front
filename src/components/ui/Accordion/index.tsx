import { useState, type ReactNode, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

type AccordionProps = {
  header: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
};

const Accordion = ({ header, children, defaultOpen = false }: AccordionProps) => {
  const [open, setOpen] = useState(defaultOpen);
  const [height, setHeight] = useState("0px");
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(open ? `${contentRef.current.scrollHeight}px` : "0px");
    }
  }, [open]);

  return (
    <div className="shadow rounded-lg overflow-hidden bg-white">
      {/* HEADER */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full cursor-pointer flex items-center justify-between p-4 text-left hover:bg-white transition"
      >
        <div className="flex-1">{header}</div>

        <ChevronDown
          className={`transition-transform duration-300 ${open ? "rotate-180" : ""} ms-3`}
          size={18}
        />
      </button>

      {/* BODY */}
      <div
        style={{ maxHeight: height }}
        className=" transition-all duration-300 ease-in-out"
      >
        <div
          ref={contentRef}
          className="border-t border-primary/10 p-4 bg-light"
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Accordion;