import { useEffect, useState } from "react";
import Section from "../../components/ui/Section"
import DashboardItem from "./DashboardItem"
import formatCentsToRealBRL from "../../utils/formatCentsToRealBRL";
import { useLoader } from "../../contexts/Loader/useLoader";
import { DashboardService } from "../../services/dashboard";
import { NavLink } from "react-router";
import { BanknoteArrowDown, BanknoteArrowUp, BanknoteX, CalendarArrowUp } from "lucide-react";

interface IInfo {
  totalCustomers: number;
  totalLoans: number;
  totalAmountLoaned: number;
  totalAmountLoanedWithInterest: number;
  totalReceived: number;
  totalPending: number;
  interestReceived: number;
  interestPending: number;
  averageTax: number;
  customersOverdue: ITimelineItem[];
}

export interface ITimelineItem {
  id: number;
  type: 'loan' | 'payment';
  amount: number;
  date: string;
  customerName: string;
}

const Dashboard = () => {
  const { showLoader, hideLoader } = useLoader();
  const [info, setInfo] = useState<IInfo | null>(null);
  const [timeline, setTimeline] = useState<ITimelineItem[]>([]);
  const [nextPayments, setNextPayments] = useState<ITimelineItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      showLoader();
      try {
        const [dashboardInfo, timelineData, nextPaymentsData] = await Promise.all([
          DashboardService.getInfo(),
          DashboardService.getTimeline({ limit: 5 }),
          DashboardService.getNextPayments({ limit: 0 }),
        ]);
        setInfo(dashboardInfo);
        setTimeline(timelineData.timeline);
        setNextPayments(nextPaymentsData.timeline);
      } catch (error) {
        console.error('Erro ao buscar informações:', error);
      }
      hideLoader();
    };

    fetchData();
  }, [])


  return (
    <>
      <Section title="Bem vindo, Turco">
        <p className="text-primary/70 mb-4">
          Aqui está um resumo das operações da Turcoin.
        </p>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <DashboardItem
              title={`${info?.totalCustomers || 0}`}
              value="Clientes"
              alignCenter
            />
            <DashboardItem
              title={`${info?.totalLoans || 0}`}
              value="Empréstimos"
              alignCenter
            />
          </div>
          <DashboardItem
            title={`${info?.averageTax || 0}%`}
            value="Taxa média"
            alignCenter
          />
          <div className="my-4">
            <h3 className="text-primary/80 border-b border-secondary mb-2">Empréstimos</h3>
            <div className="flex gap-2">
              <DashboardItem
                title={`${formatCentsToRealBRL(info?.totalAmountLoaned || 0) || 0}`}
                value="Total"
                smallText
              />
              <DashboardItem
                title={`${formatCentsToRealBRL(info?.totalAmountLoanedWithInterest || 0) || 0}`}
                value="Total c/ juros"
                smallText
              />
            </div>
            <DashboardItem
              title={`${formatCentsToRealBRL((info?.totalAmountLoanedWithInterest || 0) - (info?.totalAmountLoaned || 0)) || 0}`}
              value="Lucro total"
              smallText
              alignCenter
            />
          </div>
          <div className="mb-6">
            <h3 className="text-primary/80 border-b border-green-500 mb-2">Recebido</h3>
            <div className="flex gap-2 mb-3">
              <DashboardItem
                title={`${formatCentsToRealBRL(info?.totalReceived || 0) || 0}`}
                value="Total"
                smallText
              />
              <DashboardItem
                title={`${formatCentsToRealBRL(info?.interestReceived || 0) || 0}`}
                value="Lucro"
                smallText
              />
            </div>
            {nextPayments.length > 0 ? (
              <div className="px-2">
                <h3 className="text-primary/70 text-sm mb-1">Próximos pagamentos</h3>
                <ol>
                  {nextPayments?.map((item) => (
                    <li key={item.id} className="border-b border-primary/10 py-2 text-sm text-primary/80">
                      <div className="flex gap-3 items-center justify-between">
                        <div className="flex gap-3">
                          <CalendarArrowUp size={18} className="text-primary" />
                          <span>{new Date(item.date).toLocaleDateString()}</span>
                          <span>{item.customerName}</span>
                        </div>
                        <p>{formatCentsToRealBRL(item.amount, false)}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            ) : (
              <div className="mx-auto">
                <p className="text-primary/70 text-center">Nenhum pagamento previsto.</p>
              </div>
            )}
          </div>
          <div className="mb-6">
            <h3 className="text-primary/80 border-b border-yellow-400 mb-2">Pendente/Atrasado</h3>
            <div className="flex gap-2 mb-3">
              <DashboardItem
                title={`${formatCentsToRealBRL(info?.totalPending || 0) || 0}`}
                value="Total"
                smallText
              />
              <DashboardItem
                title={`${formatCentsToRealBRL(info?.interestPending || 0) || 0}`}
                value="Lucro"
                smallText
              />
            </div>
            {info?.customersOverdue && info?.customersOverdue.length > 0 ? (
              <div className="px-2">
                <h3 className="text-primary/70 text-sm mb-1">Pagamentos atrasados</h3>
                <ol>
                  {info.customersOverdue?.map((item) => (
                    <li key={item.id} className="border-b border-primary/10 py-2 text-sm text-primary/80">
                      <div className="flex gap-3 items-center justify-between">
                        <div className="flex gap-3">
                          <BanknoteX size={20} className="text-red-600" />
                          <span className="text-sm text-primary/80">{new Date(item.date).toLocaleDateString()}</span>
                          <span>{item.customerName}</span>
                        </div>
                        <p>{formatCentsToRealBRL(item.amount, false)}</p>
                      </div>
                    </li>
                  ))}
                  <li className="flex justify-between mt-2 text-sm font-bold text-primary/80">
                    <span>Total em atraso</span>
                    <span>{formatCentsToRealBRL(info.customersOverdue.reduce((total, customer) => total + customer.amount, 0), false)}</span>
                  </li>
                </ol>
              </div>
            ) : (
              <div className="mx-auto">
                <p className="text-primary/70 text-center">Nenhum pagamento previsto.</p>
              </div>
            )}
          </div>
          <div>
            <h3 className="flex items-center justify-between border-b border-primary/50 mb-2">Histórico de operações</h3>
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
            <NavLink to="/timeline" className="text-primary text-sm flex justify-center underline p-2 rounded bg-primary/10">
              Ver todas
            </NavLink>
          </div>
        </div>
      </Section>
    </>
  )
}

export default Dashboard