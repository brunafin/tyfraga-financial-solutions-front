import Section from "../../components/ui/Section";
import ButtonLink from "../../components/ui/ButtonNavLink";
import CustomerListItem from "./CustomerListItem";
import QueryError from "../../components/QueryError";
import { useCustomers } from "../../hooks/queries";

const Customers = () => {
  const { data: list = [], isError } = useCustomers();

  return (
    <Section title="Clientes">
      <div className="flex justify-end mb-4">
        <ButtonLink to="/customers/create">Novo cliente</ButtonLink>
      </div>

      {isError ? (
        <QueryError message="Não foi possível carregar os clientes." />
      ) : list.length > 0 ? (
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
    </Section>
  );
};

export default Customers;
