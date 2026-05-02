import { NavLink, Outlet } from "react-router"
import Section from "../../components/ui/Section"
import { useEffect, useState } from "react"
import { CustomerService } from "../../services/customer"
import type { ICustomerListItem } from "./types"
import { useLoader } from "../../contexts/Loader/useLoader"
import ButtonLink from "../../components/ui/ButtonNavLink"
import { ChevronRight } from "lucide-react"

const Customers = () => {
  const [list, setList] = useState<ICustomerListItem[]>([]);
  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    const fetchCustomers = async () => {
      showLoader();
      try {
        const { customers } = await CustomerService.getCustomers();
        setList(customers);
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
      {list.length > 0 ? (
        <ul>
          {list.map((customer) => (
            <li key={customer.uuid} className="bg-white p-2 shadow-sm rounded-md mb-2">
              <NavLink to={`/customers/${customer.uuid}`} className="flex justify-between items-center hover:bg-gray-100 rounded-md p-2">
                <div>
                  <p><strong>Nome:</strong> {customer.name}</p>
                  <p><strong>Empréstimos:</strong> {customer.loansCount}</p>
                </div>
                <ChevronRight className="text-secondary" />
              </NavLink>
            </li>
          ))}
        </ul>
      ) : (<p>Nenhum cliente encontrado</p>)}
      <Outlet />
    </Section>
  )
}

export default Customers