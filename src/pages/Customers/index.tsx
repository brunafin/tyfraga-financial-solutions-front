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
    >
      <div className="flex justify-end mb-2">
        <ButtonLink to="/customers/create">
          Novo cliente
        </ButtonLink>
      </div>
      {list.length > 0 ? (
        <>
          {/* <p className="text-sm text-primary/80 border-b border-primary/10 mb-3">{list.length} clientes encontrados</p> */}
          <ul>
            {list.map((customer) => (
              <li key={customer.uuid} className="bg-white p-2 shadow-sm rounded-md mb-2">
                <NavLink to={`/customers/${customer.uuid}`} className="flex justify-between items-center rounded-md p-2">
                  {customer.name}
                  <ChevronRight className="text-primary/50" />
                </NavLink>
              </li>
            ))}
          </ul>
        </>
      ) : (<p>Nenhum cliente encontrado</p>)}
      <Outlet />
    </Section>
  )
}

export default Customers