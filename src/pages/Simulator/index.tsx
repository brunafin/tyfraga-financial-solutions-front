import { useEffect, useState } from "react";
import type { ICustomerListItem } from "../Customers/types";
import { CustomerService } from "../../services/customer";
import Section from "../../components/ui/Section";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import Button from "../../components/ui/Button";
import { useLoader } from "../../contexts/Loader/useLoader";
import TaxBadge from "../../components/ui/TaxBadge";
import InputSelect from "../../components/ui/Input/InputSelect";
import InputDate from "../../components/ui/Input/InputDate";
import InputCurrency from "../../components/ui/Input/InputCurrency";
import InputRadio from "../../components/ui/Input/InputRadio";
import InputPercentage from "../../components/ui/Input/InputPercentage";
import { calculateByRate } from "../../utils/calculateInstallmentValue";
import { calculateByInstallment } from "../../utils/calculateTax";
import Table from "../../components/ui/Table";
import formatToCurrencyBRL from "../../utils/formatToCurrencyBRL";
import { formatDateBR } from "../../utils/formatDateBR";
import { LoanService } from "../../services/loan";
import IconButton from "../../components/ui/ButtonIcon";
import { PlusCircle, TrashIcon } from "lucide-react";
import { useNavigate } from "react-router";

const schema = z.object({
    customer_id: z.string(),
    initial_date: z.string(),
    value: z.number().positive("O valor deve ser positivo").nullable(),
    installment_value: z.number().positive("O valor da parcela deve ser positivo"),
    tax: z.number().min(0, "A taxa deve ser um número positivo ou zero"),
    observation: z.string().optional(),
    type: z.enum(["tax", "installment"]),
    payment_dates: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof schema>;

const Simulator = () => {
    const navigate = useNavigate();
    const { showLoader, hideLoader } = useLoader();
    const [customers, setCustomers] = useState<ICustomerListItem[]>([]);
    const [calculationResult, setCalculationResult] = useState<any | null>(null);
    const [tableData, setTableData] = useState<any[]>([]);

    const {
        register,
        control,
        watch,
        getValues,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            customer_id: "",
            initial_date: new Date().toISOString().split("T")[0],
            value: null,
            installment_value: 0,
            tax: 20,
            observation: "",
            payment_dates: [],
            type: "tax",
        }
    });

    const formValues = watch();

    useEffect(() => {
        const fetchCustomers = async () => {
            showLoader();
            try {
                const customers = await CustomerService.getCustomers();
                setCustomers(customers.customers);
            } catch (error) {
                console.error('Erro ao buscar clientes:', error);
            }
            hideLoader();
        };

        fetchCustomers();
    }, [])

    const onSubmit = async (data: FormData) => {
        if (!data.value) {
            return alert("Preencha o valor do empréstimo");
        }
        const obj = {
            customer_id: data.customer_id,
            original_value: data.value,
            loan_value: calculationResult?.totalWithInterest * 100,
            loan_date: data.initial_date,
            tax: data.tax,
            installment_value: data.installment_value,
            installments: formValues.payment_dates?.map((date, index) => ({
                ref: index + 1,
                due_date: date,
            })) || [],
            observation: data.observation,
        }
        try {
            showLoader();
            await LoanService.createLoan(obj);
            alert("Empréstimo criado com sucesso!");
            navigate(`/customers/${data.customer_id}`);
        } catch (error) {
            console.error('Erro ao criar empréstimo:', error);
            alert("Ocorreu um erro ao criar o empréstimo. Por favor, tente novamente.");
        } finally {
            hideLoader();
        }
    };

    const handleCalculationLoan = () => {
        const values = watch();

        const payment_dates: Date[] =
            formValues.payment_dates
                ?.map((date) => (date ? new Date(date) : null))
                .filter(Boolean) as Date[] || [];
        if (formValues.payment_dates?.length !== formValues.payment_dates?.length || 0 || payment_dates.length === 0) {
            console.log('Datas de pagamento:', payment_dates, 'Número de parcelas:', formValues.payment_dates?.length);
            alert("Preencha todas as datas das parcelas");
            return;
        }

        const loanDate = new Date(formValues.initial_date);
        const principal = (formValues.value || 0) / 100;
        const installmentValue = (values.installment_value || 0) / 100;

        let result: any = null;

        if (formValues.type === "tax") {
            console.log(formValues.tax, 'taxa de juros');
            result = calculateByRate(
                principal,
                formValues.tax / 100,
                loanDate,
                payment_dates
            );
            setValue("installment_value", result.installmentValue * 100);
            const tableDataResult =
                formValues.payment_dates?.map((date, index) => ({
                    installment: index + 1,
                    due_date: formatDateBR(date),
                    installmentValue: result?.installmentValue
                        ? `${formatToCurrencyBRL(result.installmentValue)}`
                        : "—",
                })) || [];
            setTableData(tableDataResult)
        } else {
            result = calculateByInstallment(
                principal,
                installmentValue,
                loanDate,
                payment_dates
            );
            setValue("tax", result.monthlyRate, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
            });
            const tableDataResult =
                formValues.payment_dates?.map((date, index) => ({
                    installment: index + 1,
                    due_date: formatDateBR(date),
                    installmentValue: installmentValue
                        ? `${formatToCurrencyBRL(installmentValue)}`
                        : "—",
                })) || [];
            setTableData(tableDataResult)
        }

        setCalculationResult(result);

    };

    return (
        <Section title="Simulador">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-5">
                    <div className="flex items-end gap-2">
                        <div className="flex-1">
                            <InputSelect
                                control={control}
                                label="Cliente"
                                name="customer_id"
                                options={customers.map(customer => ({
                                    label: customer.name,
                                    value: customer.uuid,
                                }))}
                                errors={errors}
                                placeholder="Selecione um cliente"
                            />
                        </div>
                    </div>
                    <div>
                        <InputDate
                            label="Data empréstimo"
                            name="initial_date"
                            register={register}
                            errors={errors}
                        />
                    </div>
                    <div>
                        <InputCurrency
                            control={control}
                            label="Valor do empréstimo"
                            name="value"
                            errors={errors}
                        />
                    </div>
                    <div>
                        <InputRadio
                            control={control}
                            label="Tipo"
                            name="type"
                            inline
                            options={[
                                { label: "Taxa", value: "tax" },
                                { label: "Parcela definida", value: "installment" },
                            ]}
                        />
                    </div>
                    {formValues.type === "tax" && (
                        <>
                            <div>
                                <TaxBadge tax={customers.find((item) => item.uuid === watch('customer_id'))?.averageTax || 20} taxByCustomer={!!formValues.customer_id && !!customers.find((item) => item.uuid === watch('customer_id'))?.averageTax} />
                            </div>
                            <div>
                                <InputPercentage
                                    control={control}
                                    label="Taxa de juros (%)"
                                    name="tax"
                                    errors={errors}
                                />
                            </div>
                        </>
                    )}
                    {formValues.type === "installment" && (
                    <div>
                        <InputCurrency
                            control={control}
                            label="Valor da parcela"
                            name="installment_value"
                            errors={errors}
                        />
                    </div>
                    )}
                    <div>
                        <h2 className="text-lg text-primary mt-4 border-b border-secondary/50">Vencimentos</h2>
                    </div>
                    <div>
                        {formValues.payment_dates && formValues.payment_dates.length > 0 &&
                            Array.from({ length: formValues.payment_dates.length }).map((_, index) => (
                                <div key={index} className=" flex items-end mb-4">
                                    <div className="flex-1">
                                        <InputDate
                                            label={`Data da parcela ${index + 1}`}
                                            name={`payment_dates.${index}`}
                                            register={register}
                                            errors={errors}
                                        />
                                    </div>

                                    {index > 0 && (
                                        <IconButton
                                            variant="destructive"
                                            label="Remover parcela"
                                            icon={<TrashIcon />}
                                            onClick={() => {
                                                const currentDates = getValues("payment_dates") || [];
                                                setValue("payment_dates", currentDates.filter((_: any, i: number) => i !== index), { shouldDirty: true });

                                            }}
                                        />
                                    )}
                                </div>
                            ))}
                        <div className="flex justify-center">
                            <Button type="button" className="flex items-center gap-2" variant="link_primary" onClick={() => {
                                const currentDates = getValues("payment_dates") || [];
                                setValue("payment_dates", [...currentDates, ""], { shouldDirty: true });
                            }}>
                                <PlusCircle /> Adicionar parcela
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="my-8">
                    <Button size="full" type="button" disabled={!!formValues.payment_dates?.some((item) => !item)} onClick={() => handleCalculationLoan()}>
                        Simular
                    </Button>
                </div>
                {calculationResult && (
                    <div className="mt-8 mb-16 py-3">
                        <h2 className="text-xl mb-3">Resultado da simulação:</h2>
                        <>
                            <div className="mb-3 border border-secondary bg-secondary/20 rounded-sm p-3">
                                <p>Valor total a pagar: <strong>{formatToCurrencyBRL(calculationResult.totalWithInterest)}</strong></p>
                                <p>Valor total de juros: <strong>{formatToCurrencyBRL(calculationResult.totalInterest)}</strong></p>
                                <p>Taxa mensal: <strong>{calculationResult.monthlyRate}%</strong></p>
                            </div>
                            <div>
                                <Table
                                    columns={[
                                        { header: "Parcela", accessor: "installment" },
                                        { header: "Vencimento", accessor: "due_date" },
                                        { header: "Valor", accessor: "installmentValue" },
                                    ]}
                                    data={tableData}
                                />
                            </div>
                        </>
                    </div>
                )}
                {calculationResult && formValues.customer_id && (
                    <div className="mb-8">
                        <Button size="full" type="submit" variant="secondary">
                            Emprestar
                        </Button>
                    </div>
                )}
            </form>
        </Section >
    );
};

export default Simulator;