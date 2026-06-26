import { useEffect, useState } from "react";
import Section from "../../components/ui/Section";
import TimelineList from "../../components/TimelineList";
import type { ITimelineItem } from "../Dashboard";
import { useLoader } from "../../contexts/Loader/useLoader";
import { DashboardService } from "../../services/dashboard";

const Timeline = () => {
  const { showLoader, hideLoader } = useLoader();
  const [timeline, setTimeline] = useState<ITimelineItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      showLoader();
      try {
        const [timelineData] = await Promise.all([
          DashboardService.getTimeline({ limit: 0 }),
        ]);
        setTimeline(timelineData.timeline);
      } catch (error) {
        console.error("Erro ao buscar informações:", error);
      }
      hideLoader();
    };

    fetchData();
  }, []);

  return (
    <Section title="Histórico de operações" goBack>
      <TimelineList items={timeline} />
    </Section>
  );
};

export default Timeline;
