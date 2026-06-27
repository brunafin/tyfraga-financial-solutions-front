import { useParams } from "react-router";
import Section from "../../components/ui/Section";
import { useLoader } from "../../contexts/Loader/useLoader";
import Button from "../../components/ui/Button";
import LoanSummaryCard from "./LoanSummaryCard";
import InstallmentCard from "./InstallmentCard";
import QueryError from "../../components/QueryError";
import {
  useDeleteLoan,
  useLoan,
  usePayInstallment,
} from "../../hooks/queries";

const LoanDetails = () => {
  const { id } = useParams();
  const { showLoader, hideLoader } = useLoader();
  const { data: loan, isError } = useLoan(id!);
  const payInstallment = usePayInstallment(id!);
  const deleteLoan = useDeleteLoan();

  const handleDeleteLoan = async (loanId: string) => {
    showLoader();
    try {
      await deleteLoan.mutateAsync(loanId);
      alert("Empréstimo excluído com sucesso!");
      window.history.back();
    } catch (error) {
      console.error("Erro ao excluir empréstimo:", error);
      alert("Ocorreu um erro ao excluir o empréstimo. Tente novamente.");
    } finally {
      hideLoader();
    }
  };

  const handlePay = async (installmentId: number) => {
    showLoader();
    try {
      await payInstallment.mutateAsync(installmentId);
    } catch (error) {
      console.error(error);
      alert("Não foi possível registrar o pagamento.");
    } finally {
      hideLoader();
    }
  };

  if (isError) {
    return (
      <Section title="Detalhes do Empréstimo" goBack>
        <QueryError message="Não foi possível carregar o empréstimo." />
      </Section>
    );
  }

  if (!loan) {
    return (
      <Section title="Detalhes do Empréstimo" goBack>
        <></>
      </Section>
    );
  }

  const payments = loan.payments ?? [];
  const paidCount = payments.filter((payment) => payment.payedDate).length;

  return (
    <Section title="Detalhes do Empréstimo" goBack>
      <div className="flex flex-col gap-6">
        <LoanSummaryCard
          loanDate={loan.loanDate}
          tax={loan.tax}
          originalValue={loan.originalValue}
          loanValue={loan.loanValue}
        />

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="section-title">
              Parcelas
            </h3>
            <span className="text-sm text-text/50 sm:text-base">
              {paidCount} de {payments.length}
            </span>
          </div>

          {payments.length > 0 ? (
            <ol className="flex flex-col gap-3">
              {payments.map((installment) => (
                <InstallmentCard
                  key={installment.id}
                  installmentRef={installment.installmentRef}
                  installmentValue={installment.installmentValue}
                  dueDate={installment.dueDate}
                  payedDate={installment.payedDate}
                  observation={installment.observation}
                  onMarkAsPaid={() => handlePay(installment.id)}
                />
              ))}
            </ol>
          ) : (
            <p className="text-sm text-text/60 sm:text-base">
              Nenhuma parcela encontrada.
            </p>
          )}
        </section>

        <Button
          variant="destructive"
          onClick={() => {
            if (
              window.confirm("Tem certeza que deseja excluir este empréstimo?")
            ) {
              handleDeleteLoan(id!);
            }
          }}
        >
          Excluir Empréstimo
        </Button>
      </div>
    </Section>
  );
};

export default LoanDetails;
