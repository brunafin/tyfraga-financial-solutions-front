import { useEffect, useState } from "react";
import Section from "../../components/ui/Section";
import type { ITimelineItem } from "../Dashboard";
import { useLoader } from "../../contexts/Loader/useLoader";
import { DashboardService } from "../../services/dashboard";
import formatCentsToRealBRL from "../../utils/formatCentsToRealBRL";
import { BanknoteArrowDown, BanknoteArrowUp } from "lucide-react";

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
                console.error('Erro ao buscar informações:', error);
            }
            hideLoader();
        };

        fetchData();
    }, [])

    return (
        <Section title="Histórico de operações" goBack>
            <ol className="px-2">
                {timeline?.map((item) => (
                    <li key={item.id} className="border-b border-primary/10 py-2 text-sm">
                        <div className="flex gap-3 items-center justify-between">
                            <div className="flex gap-3">
                                {item.type === 'payment' ? <BanknoteArrowUp size={20} className="text-green-600" /> : <BanknoteArrowDown size={20} className="text-secondary" />}
                                <span className="text-sm text-primary/70">{new Date(item.date).toLocaleDateString()}</span>
                                <span className="font-bold">{item.customerName}</span>
                            </div>
                            <p>{formatCentsToRealBRL(item.amount, false)}</p>
                        </div>
                    </li>
                ))}
            </ol>
        </Section>
    );
};

export default Timeline;