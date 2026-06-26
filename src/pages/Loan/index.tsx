import { useParams } from "react-router";
import Section from "../../components/ui/Section";
import { useEffect, useState } from "react";
import { useLoader } from "../../contexts/Loader/useLoader";
import { LoanService } from "../../services/loan";
import Button from "../../components/ui/Button";
import LoanSummaryCard from "./LoanSummaryCard";
import InstallmentCard from "./InstallmentCard";

interface ILoanDetail {
  uuid: string;
  originalValue: number;
  loanValue: number;
  loanDate: string;
  tax: number;
  payments: {
    id: number;
    installmentRef: number;
    installmentValue: number;
    dueDate: string;
    payedValue: number;
    payedDate: string | null;
    observation: string | null;
  }[];
}

const LoanDetails = () => {
  const { id } = useParams();
  const { showLoader, hideLoader, loading } = useLoader();
  const [loan, setLoan] = useState<ILoanDetail | null>(null);

  const fetchLoanById = async () => {
    showLoader();
    try {
      const loan = await LoanService.getLoanById(id!);
      setLoan(loan);
    } catch (error) {
      console.error("Erro ao buscar empréstimo:", error);
    } finally {
      hideLoader();
    }
  };

  useEffect(() => {
    if (id) {
      fetchLoanById();
    }
  }, [id]);

  const handleDeleteLoan = async (loanId: string) => {
    showLoader();
    try {
      await LoanService.deleteLoan(loanId);
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
      await LoanService.checkPayDate(installmentId);
      await fetchLoanById();
    } catch (error) {
      console.error(error);
    } finally {
      hideLoader();
    }
  };

  if (loading) {
    return <></>;
  }

  const payments = loan?.payments ?? [];
  const paidCount = payments.filter((payment) => payment.payedDate).length;

  return (
    <Section title="Detalhes do Empréstimo" goBack>
      {loan && (
        <div className="flex flex-col gap-6">
          <LoanSummaryCard
            loanDate={loan.loanDate}
            tax={loan.tax}
            originalValue={loan.originalValue}
            loanValue={loan.loanValue}
          />

          <section>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xs font-medium tracking-wide text-text/50 uppercase">
                Parcelas
              </h3>
              <span className="text-sm text-text/50">
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
              <p className="text-sm text-text/60">
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
      )}
    </Section>
  );
};

export default LoanDetails;
