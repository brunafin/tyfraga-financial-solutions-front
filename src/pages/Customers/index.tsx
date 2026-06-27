import { Outlet } from "react-router";
import Section from "../../components/ui/Section";
import { useEffect, useState } from "react";
import { CustomerService } from "../../services/customer";
import type { ICustomerListItem } from "./types";
import { useLoader } from "../../contexts/Loader/useLoader";
import ButtonLink from "../../components/ui/ButtonNavLink";
import CustomerListItem from "./CustomerListItem";

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
        console.error("Erro ao buscar clientes:", error);
      }
      hideLoader();
    };

    fetchCustomers();
  }, []);

  return (
    <Section title="Clientes">
      <div className="flex justify-end mb-4">
        <ButtonLink to="/customers/create">Novo cliente</ButtonLink>
      </div>

      {list.length > 0 ? (
        <ul className="flex flex-col gap-3">
          {list.map((customer, index) => (
            <CustomerListItem
              key={customer.uuid}
              uuid={customer.uuid}
              name={customer.name}
              loansCount={customer.loansCount}
              index={index}
            />
          ))}
        </ul>
      ) : (
        <p className="text-sm text-text/60 sm:text-base">Nenhum cliente encontrado</p>
      )}

      <Outlet />
    </Section>
  );
};

export default Customers;
