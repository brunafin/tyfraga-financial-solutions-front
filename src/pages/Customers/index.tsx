import { PlusIcon } from "@heroicons/react/16/solid"
import CustomerCard from "./CustomerCard"
import { NavLink, Outlet } from "react-router"
import Section from "../../components/ui/Section"
import { useEffect, useState } from "react"
import { CustomerService } from "../../services/customer"
import type { ICustomerListItem } from "./types"

const Customers = () => {
  const [list, setList] = useState<ICustomerListItem[]>([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const customers = await CustomerService.getCustomers();
        console.log('customers', customers);
        setList(customers.customers);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
      }
    };

    fetchCustomers();
  },[])

  return (
    <Section title="Clientes">
      <header className="flex items-center justify-between">
        <NavLink to="/customers/create" className="w-full font-bold text-sm bg-red-600 text-white flex items-center justify-center gap-2 p-2 rounded-md">
          <PlusIcon className="w-6" /> Novo cliente
        </NavLink>
      </header>
      <ul className="flex flex-col gap-3 pt-8">
        {list.map((customer) => (
          <CustomerCard
            uuid={customer.uuid}
            name={customer.name}
            loansCount={0}
          />
        ))}
      </ul>
      <Outlet />
    </Section>
  )
}

export default Customers