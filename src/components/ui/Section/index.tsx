import Title from "../Title";

type SectionProps = {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
};

const Section = ({ title, children, action }: SectionProps) => {
  return (
    <section className="p-4">
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