import Section from "../../components/ui/Section"
import DashboardItem from "./DashboardItem"

const Dashboard = () => {
  return (
    <>
      <Section title="Bem vindo, Tiago">
        <p className="text-gray-700 mb-4">
          Aqui está um resumo das suas finanças. Acompanhe seus empréstimos, lucros e muito mais.
        </p>
        <div className="flex flex-col gap-3">
        <DashboardItem
          title="Total emprestado"
          value={1000}
        />
        <DashboardItem
          title="Total de lucro"
          value={1500}
        />
        </div>
      </Section>
    </>
  )
}

export default Dashboard