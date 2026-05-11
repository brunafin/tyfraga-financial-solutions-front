import { useEffect, useState } from "react";
import Section from "../../components/ui/Section"
import DashboardItem from "./DashboardItem"
import formatCentsToRealBRL from "../../utils/formatCentsToRealBRL";
import { useLoader } from "../../contexts/Loader/useLoader";
import { DashboardService } from "../../services/dashboard";

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
  customersOverdue: Array<{
    name: string;
    amountOverdue: number;
  }>;
}

const Dashboard = () => {
  const { showLoader, hideLoader } = useLoader();
  const [info, setInfo] = useState<IInfo | null>(null);

  useEffect(() => {
    const fetchInfoByDashboard = async () => {
      showLoader();
      try {
        const info = await DashboardService.getInfo();
        setInfo(info);
      } catch (error) {
        console.error('Erro ao buscar informações do Dashboard:', error);
      }
      hideLoader();
    };

    fetchInfoByDashboard();
  }, [])


  return (
    <>
      <Section title="Bem vindo, Tiago">
        <p className="text-primary/70 mb-4 text-sm">
          Aqui está um resumo das operações da Turcoin.
        </p>
        <div className="flex flex-col gap-3">
          {info?.customersOverdue.length && (
            <div className="p-4 bg-gray-50 rounded shadow">
              <h3 className="text-lg font-bold text-red-700">Clientes em atraso</h3>
              <ul>
                {info.customersOverdue.map((customer, index) => (
                  <li key={index} className="flex justify-between">
                    <span>{customer.name}</span>
                    <span>{formatCentsToRealBRL(customer.amountOverdue)}</span>
                  </li>
                ))}
                <li className="flex justify-between mt-2 border-t border-primary/10 pt-2">
                  <span>Total em atraso</span>
                  <span className="font-bold">{formatCentsToRealBRL(info.customersOverdue.reduce((total, customer) => total + customer.amountOverdue, 0))}</span>
                </li>
              </ul>
            </div>
          )}
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
          <div>
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
          </div>
          <div>
            <h3 className="text-primary/80 border-b border-green-500 mb-2">Recebido</h3>
            <div className="flex gap-2">
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
          </div>
          <div>
            <h3 className="text-primary/80 border-b border-yellow-400 mb-2">Pendente</h3>
            <div className="flex gap-2">
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
          </div>
        </div>
      </Section>
    </>
  )
}

export default Dashboard