import { Outlet } from "react-router"
import Section from "../../components/ui/Section"
import { useEffect, useState } from "react"
import { CustomerService } from "../../services/customer"
import type { ICustomerListItem } from "./types"
import { useLoader } from "../../contexts/Loader/useLoader"
import ButtonLink from "../../components/ui/ButtonNavLink"
import Table from "../../components/ui/Table"
import { Eye } from "lucide-react"
import ButtonIconNavLink from "../../components/ui/ButtonIconNavLink"

const Customers = () => {
  const [list, setList] = useState<ICustomerListItem[]>([]);
  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    const fetchCustomers = async () => {
      showLoader();
      try {
        const customers = await CustomerService.getCustomers();
        console.log('customers', customers);
        setList(customers.customers);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
      }
      hideLoader();
    };

    fetchCustomers();
  }, [])

  return (
    <Section
      title="Clientes"
      action={
        <ButtonLink to="/customers/create">
          Novo cliente
        </ButtonLink>
      }
    >
      <Table
        counterInfo={`${list.length} cliente${list.length !== 1 ? 's' : ''} encontrado${list.length !== 1 ? 's' : ''}`}
        columns={[
          { header: 'ID', accessor: 'uuid' },
          { header: 'Nome', accessor: 'name' },
          { header: 'Telefone', accessor: 'phone' },
          { header: 'Empréstimo', accessor: 'loansCount' },
          { header: 'Status', accessor: 'status' },
          {
            header: "Ações",
            accessor: "uuid",
            render: (_, row) => (
              <div className="flex justify-end gap-2">
                <ButtonIconNavLink
                  to={`/customers/${row.uuid}`}
                  icon={<Eye size={16} />}
                  label="Ver detalhes do cliente"
                />

              </div>
            ),
          }
        ]}
        data={list}

      />
      <Outlet />
    </Section>
  )
}

export default Customers