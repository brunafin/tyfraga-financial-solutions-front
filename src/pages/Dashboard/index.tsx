import Section from "../../components/ui/Section";
import DashboardItem from "./DashboardItem";
import LoanPortfolioCard from "./LoanPortfolioCard";
import SummaryMetricCard from "./SummaryMetricCard";
import TimelineList from "../../components/TimelineList";
import QueryError from "../../components/QueryError";
import formatCentsToRealBRL from "../../utils/formatCentsToRealBRL";
import {
  useDashboard,
  useNextPayments,
  useTimeline,
} from "../../hooks/queries";
import { NavLink } from "react-router";

export interface ITimelineItem {
  id: number;
  type: 'loan' | 'payment';
  amount: number;
  date: string;
  customerName: string;
}

const formatValue = (value: number) =>
  formatCentsToRealBRL(value) ?? "R$ 0,00";

const sectionTitleClass = "section-title";

const Dashboard = () => {
  const dashboardQuery = useDashboard();
  const timelineQuery = useTimeline(5);
  const nextPaymentsQuery = useNextPayments(5);

  const isError =
    dashboardQuery.isError ||
    timelineQuery.isError ||
    nextPaymentsQuery.isError;

  const info = dashboardQuery.data;
  const timeline = timelineQuery.data ?? [];
  const nextPayments = nextPaymentsQuery.data ?? [];

  if (isError) {
    return (
      <Section title="Bem vindo, Turco" hideDivider>
        <QueryError message="Não foi possível carregar o dashboard." />
      </Section>
    );
  }

  return (
    <>
      <Section title="Bem vindo, Turco" hideDivider>
        <p className="mb-4 text-sm text-text/70 sm:text-base">
          Aqui está um resumo das operações.
        </p>
        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
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
            title={`${(info?.averageTax ?? 0).toFixed(2)}%`}
            value="Taxa média"
            alignCenter
            variant="gradient"
          />
          <div className="mt-4">
            <h3 className={`${sectionTitleClass} mb-3`}>Carteira de Empréstimos</h3>
            <LoanPortfolioCard
              principal={info?.totalAmountLoaned || 0}
              totalWithInterest={info?.totalAmountLoanedWithInterest || 0}
            />
          </div>
          <div className="mb-6">
            <h3 className={`${sectionTitleClass} mb-3`}>Recebido</h3>
            <div className="mb-4 flex gap-3">
              <SummaryMetricCard
                value={formatValue(info?.totalReceived || 0)}
                label="Total"
                accent="green"
              />
              <SummaryMetricCard
                value={formatValue(info?.interestReceived || 0)}
                label="Lucro"
              />
            </div>
            {nextPayments.length > 0 ? (
              <div>
                <h4 className={`${sectionTitleClass} mb-2`}>Próximos pagamentos</h4>
                <ol>
                  {nextPayments.map((item, index) => (
                    <li key={`${item.date}-${item.customerName}-${index}`} className="border-b border-primary/10 py-2 list-row-text">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex min-w-0 flex-1 items-center gap-2">
                          <span className="shrink-0 whitespace-nowrap">{new Date(item.date).toLocaleDateString()}</span>
                          <span className="min-w-0 truncate">{item.customerName}</span>
                        </div>
                        <p className="shrink-0 whitespace-nowrap font-medium text-primary">{formatCentsToRealBRL(item.amount, false)}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            ) : (
              <div className="mx-auto">
                <p className="text-text/70 text-center">Nenhum pagamento previsto.</p>
              </div>
            )}
          </div>
          <div className="mb-6">
            <h3 className={`${sectionTitleClass} mb-3`}>Pendente/Atrasado</h3>
            <div className="mb-4 flex gap-3">
              <SummaryMetricCard
                value={formatValue(info?.totalPending || 0)}
                label="Total"
                accent="red"
              />
              <SummaryMetricCard
                value={formatValue(info?.interestPending || 0)}
                label="Lucro"
              />
            </div>
            {info?.customersOverdue && info.customersOverdue.length > 0 ? (
              <div>
                <h4 className={`${sectionTitleClass} mb-2`}>Pagamentos atrasados</h4>
                <ol>
                  {info.customersOverdue.map((item, index) => (
                    <li key={`${item.date}-${item.customerName}-${index}`} className="border-b border-primary/10 py-2 list-row-text">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex min-w-0 flex-1 items-center gap-2">
                          <span className="shrink-0 whitespace-nowrap">{new Date(item.date).toLocaleDateString()}</span>
                          <span className="min-w-0 truncate">{item.customerName}</span>
                        </div>
                        <p className="shrink-0 whitespace-nowrap font-medium text-primary">{formatCentsToRealBRL(item.amount, false)}</p>
                      </div>
                    </li>
                  ))}
                  <li className="mt-2 flex justify-between text-sm font-bold text-tertiary sm:text-base">
                    <span>Total em atraso</span>
                    <span>
                      {formatCentsToRealBRL(
                        info.customersOverdue.reduce((total, customer) => total + customer.amount, 0),
                        false,
                      )}
                    </span>
                  </li>
                </ol>
              </div>
            ) : (
              <div className="mx-auto">
                <p className="text-text/70 text-center">Nenhum pagamento previsto.</p>
              </div>
            )}
          </div>
          <div>
            <h3 className={`${sectionTitleClass} mb-3`}>Histórico de operações</h3>
            <TimelineList items={timeline} />
            <NavLink to="/timeline" className="mt-4 flex justify-center rounded bg-primary/10 p-2 text-sm text-text underline sm:text-base">
              Ver todas
            </NavLink>
          </div>
        </div>
      </Section>
    </>
  )
}

export default Dashboard
