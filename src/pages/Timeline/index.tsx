import Section from "../../components/ui/Section";
import TimelineList from "../../components/TimelineList";
import QueryError from "../../components/QueryError";
import { useTimeline } from "../../hooks/queries";

const Timeline = () => {
  const { data: timeline = [], isError } = useTimeline();

  return (
    <Section title="Histórico de operações" goBack>
      {isError ? (
        <QueryError message="Não foi possível carregar o histórico." />
      ) : (
        <TimelineList items={timeline} />
      )}
    </Section>
  );
};

export default Timeline;
