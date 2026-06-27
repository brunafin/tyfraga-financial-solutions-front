import { useParams } from "react-router";
import Section from "../../../components/ui/Section";
import { useEffect, useState } from "react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../../components/ui/Button";
import InputText from "../../../components/ui/Input/InputText";
import InputPhone from "../../../components/ui/Input/InputPhone";
import { Pencil } from "lucide-react";
import TaxBadge from "../../../components/ui/TaxBadge";
import formatCentsToRealBRL from "../../../utils/formatCentsToRealBRL";
import { formatLoansCount } from "../../../utils/formatLoansCount";
import DetailMetricCard from "./DetailMetricCard";
import LoanListItem from "./LoanListItem";
import QueryError from "../../../components/QueryError";
import { useCustomer, useUpdateCustomer } from "../../../hooks/queries";
import { useModal } from "../../../contexts/Modal/useModal";

const schema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  phone: z
    .string()
    .min(1, "O telefone é obrigatório")
    .regex(/^\d{10,11}$/, "O telefone deve conter 10 ou 11 dígitos"),
});

type FormData = z.infer<typeof schema>;

const formatValue = (value: number) =>
  formatCentsToRealBRL(value) ?? "R$ 0,00";

const Details = () => {
  const { id } = useParams();
  const { data: customer, isError, refetch } = useCustomer(id!);
  const updateCustomer = useUpdateCustomer(id!);
  const { showAlert } = useModal();
  const [isEdit, setIsEdit] = useState(false);
  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (customer) {
      reset({
        name: customer.name,
        phone: customer.phone,
      });
    }
  }, [customer, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      await updateCustomer.mutateAsync({
        name: data.name,
        phone: data.phone,
      });
      await refetch();
      setIsEdit(false);
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      await showAlert("Ocorreu um erro ao atualizar o cliente.");
    }
  };

  if (isError) {
    return (
      <Section title="Detalhes do Cliente" goBack>
        <QueryError message="Não foi possível carregar o cliente." />
      </Section>
    );
  }

  if (!customer) {
    return (
      <Section title="Detalhes do Cliente" goBack>
        <></>
      </Section>
    );
  }

  return (
    <Section title="Detalhes do Cliente" goBack>
      {isEdit ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mb-6 flex flex-col gap-3 border-b border-primary/10 pb-6"
        >
          <InputText
            label="Nome"
            placeholder="Digite o nome do cliente"
            name="name"
            register={register}
            errors={errors}
          />
          <InputPhone
            label="Telefone"
            name="phone"
            control={control}
            errors={errors}
          />
          <div className="flex gap-2">
            <Button
              variant="outline_primary"
              onClick={() => {
                reset({
                  name: customer.name,
                  phone: customer.phone,
                });
                setIsEdit(false);
              }}
            >
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Salvar
            </Button>
          </div>
        </form>
      ) : (
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="content-heading truncate">{customer.name}</h2>
            <p className="mt-1 text-sm text-text/50 sm:text-base">
              {formatLoansCount(customer.total_loans)}
            </p>
          </div>
          <button
            type="button"
            aria-label="Editar"
            onClick={() => setIsEdit(true)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/15 bg-white text-primary shadow-sm transition-colors hover:bg-primary/5"
          >
            <Pencil size={18} />
          </button>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <DetailMetricCard
            label="Total Emprestado"
            value={formatValue(customer.amount_loaned)}
          />
          <DetailMetricCard
            label="Total com Juros"
            value={formatValue(customer.amount_interest_loaned)}
          />
          <DetailMetricCard
            label="Total Recebido"
            value={formatValue(customer.amount_received)}
          />
          <DetailMetricCard
            label="Total lucro"
            value={formatValue(customer.profit)}
            accent="tertiary"
          />
        </div>

        {customer.amount_pending_receive !== 0 && (
          <div className="rounded-xl bg-white p-5 text-center shadow-sm">
            <p className="metric-label">Valor pendente</p>
            <p className="metric-value-hero mt-1">
              {formatValue(customer.amount_pending_receive)}
            </p>
            <p className="mt-1 text-sm font-medium text-tertiary sm:text-base">
              {formatValue(customer.profit_pending)} (lucro)
            </p>
          </div>
        )}

        <section className="mt-3 mb-20">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="text-base font-bold text-primary sm:text-lg">Empréstimos</h3>
            {customer.total_loans > 0 && (
              <TaxBadge
                tax={Number(customer.average_tax.toFixed(2))}
                taxByCustomer
              />
            )}
          </div>

          {customer.loans.length > 0 ? (
            <ul className="flex flex-col gap-3">
              {customer.loans.map((loan) => (
                <LoanListItem
                  key={loan.uuid}
                  uuid={loan.uuid}
                  loanDate={loan.loan_date}
                  loanValue={loan.loan_value}
                  status={loan.status}
                />
              ))}
            </ul>
          ) : (
            <p className="text-sm text-text/60 sm:text-base">Nenhum empréstimo encontrado.</p>
          )}
        </section>
      </div>
    </Section>
  );
};

export default Details;
