import { useParams } from "react-router";
import Section from "../../components/ui/Section";
import { useEffect, useState } from "react";
import { useLoader } from "../../contexts/Loader/useLoader";
import { LoanService } from "../../services/loan";
import formatCentsToRealBRL from "../../utils/formatCentsToRealBRL";
import TaxBadge from "../../components/ui/TaxBadge";
import Button from "../../components/ui/Button";

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
            console.error('Erro ao buscar empréstimo:', error);
        } finally {
            hideLoader();
        }
    };

    useEffect(() => {
        if (id) {
            fetchLoanById();
        }
    }, [id])

    if (loading) {
        return (
            <></>
        )
    }

    const handlePay = async (installmentId: number) => {
        showLoader();
        try {
            const response = await LoanService.checkPayDate(installmentId);
            console.log(response);
            await fetchLoanById();
        } catch (error) {
            console.error(error);
        } finally {
            hideLoader();
        }
    }

    const paymentStatus = (dueDate: string, payedDate: string | null) => {
        const now = new Date();
        const due = new Date(dueDate);

        if (payedDate) {
            return 'border-l-4 border-green-600';
        }

        if (due < now) {
            return 'border-l-4 border-red-600';
        }

        return 'border-l-4 border-amber-500';
    }

    return (
        <Section
            title="Detalhes do Empréstimo"
            goBack
        >
            <div className="text-primary">
                <div className="flex items-center gap-2 mb-3">
                    <h2 className="text-xl font-bold">Empréstimo nuḿero {loan?.uuid}</h2>
                </div>
                <ul>
                    <li>Total Emprestado: {' '}

                        {formatCentsToRealBRL(loan?.originalValue || 0)}

                    </li>
                    <li>Total com juros: {' '}

                        {formatCentsToRealBRL(loan?.loanValue || 0)}

                    </li>
                    <li className="mt-2">
                        <TaxBadge tax={loan?.tax || 0} taxByCustomer label="Taxa" />
                    </li>
                </ul>
                <ol>
                    {loan?.payments?.map(installment => (
                        <li key={installment.id} className={`mt-4 rounded-lg py-2 bg-white px-4 ${paymentStatus(installment.dueDate, installment.payedDate)}`}>
                            <p>Parcela {installment.installmentRef}</p>
                            <p>Valor: {formatCentsToRealBRL(installment.installmentValue)}</p>
                            <p>Data de vencimento: {new Date(installment.dueDate).toLocaleDateString()}</p>
                            {/* <p>Valor pago: {formatCentsToRealBRL(installment.payedValue)}</p> */}
                            <p>Data de pagamento: {installment.payedDate ? new Date(installment.payedDate).toLocaleDateString() : 'Não pago'}</p>
                            {installment.observation && <p>Observação: {installment.observation}</p>}
                            {!installment.payedDate && (
                                <Button variant="outline_primary" className="mt-2" onClick={() => handlePay(installment.id)}>
                                    Marcar como pago
                                </Button>
                            )}
                        </li>
                    ))}
                </ol>
            </div>
        </Section>
    )
}

export default LoanDetails;