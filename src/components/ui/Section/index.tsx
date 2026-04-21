import Title from "../Title";

type SectionProps = {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
};

const Section = ({ title, children, action }: SectionProps) => {
  return (
    <section className="pt-4 px-4 pb-24 md:pb-4 md:ms-20 min-h-[calc(100dvh-10vh-5rem)] md:min-h-[calc(100dvh-10vh)]">
      <div className="flex items-center justify-between mb-4">
        <Title>{title}</Title>

        {action && (
          <div>
            {action}
          </div>
        )}
      </div>

      {children}
    </section>
  );
};

export default Section;