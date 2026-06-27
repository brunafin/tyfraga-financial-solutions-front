import { ChevronLeft } from "lucide-react";
import IconButton from "../ButtonIcon";
import Title from "../Title";

type SectionProps = {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  goBack?: boolean;
  hideDivider?: boolean;
};

const Section = ({ title, children, goBack, hideDivider = false }: SectionProps) => {
  return (
    <section className="pb-24 md:pb-4 p-4 md:ms-20 min-h-[calc(100dvh-10vh-5rem)] md:min-h-[calc(100dvh-10vh)]">
      <div className={`flex ${goBack ? 'items-center justify-start' : 'items-baseline justify-between'} ${hideDivider ? 'mb-0' : 'mb-4'}`}>
        {goBack && (
          <div className="flex items-center">
            <IconButton
              className="p-1"
              label="Voltar"
              icon={<ChevronLeft size={20} />}
              onClick={() => window.history.back()}
            />
          </div>
        )}
        <Title className="page-title">{title}</Title>

        {/* {action && (
          <>
            {action}
          </>
        )} */}
      </div>
      <div>
        {children}
      </div>
    </section>
  );
};

export default Section;