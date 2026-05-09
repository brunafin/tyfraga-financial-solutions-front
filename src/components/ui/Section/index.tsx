import { ChevronLeft } from "lucide-react";
import IconButton from "../ButtonIcon";
import Title from "../Title";

type SectionProps = {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  goBack?: boolean;
};

const Section = ({ title, children, goBack }: SectionProps) => {
  return (
    <section className="pb-24 md:pb-4 p-4 md:ms-20 min-h-[calc(100dvh-10vh-5rem)] md:min-h-[calc(100dvh-10vh)]">
      <div className={`border-b border-primary/10 flex ${goBack ? 'items-center justify-start' : 'items-baseline justify-between'} mb-6`}>
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
        <Title className="font-bold text-sm">{title}</Title>

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