import { NavLink, Outlet } from "react-router"
import Section from "../../components/ui/Section"
import { useEffect, useState } from "react"
import { CustomerService } from "../../services/customer"
import type { ICustomerListItem } from "./types"
import { useLoader } from "../../contexts/Loader/useLoader"
import ButtonLink from "../../components/ui/ButtonNavLink"

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
      {list.length > 0 ? (
          <ul>
            {list.map((customer) => (
              <li key={customer.uuid} className="bg-white p-3 shadow-sm rounded-md mb-4">
                <NavLink to={`/customers/${customer.uuid}`} className="block hover:bg-gray-100 rounded-md p-2">
                  <p><strong>Nome:</strong> {customer.name}</p>
                  {/* <p><strong>Telefone:</strong> {customer.phone}</p> */}
                  <p><strong>Empréstimos:</strong> {customer.loansCount}</p>
                  {/* <p><strong>Status:</strong> {customer.status}</p> */}
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