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
import InputQuantity from "../../components/ui/Input/InputQuantity";
import InputPercentage from "../../components/ui/Input/InputPercentage";
import { calculateByRate } from "../../utils/calculateInstallmentValue";
import { calculateByInstallment } from "../../utils/calculateTax";
import Table from "../../components/ui/Table";
import formatToCurrencyBRL from "../../utils/formatToCurrencyBRL";
import { formatDateBR } from "../../utils/formatDateBR";

const schema = z.object({
    customer_id: z.string(),
    initial_date: z.string(),
    value: z.number().positive("O valor deve ser positivo").nullable(),
    installments: z.number().int().positive("O número de parcelas deve ser um inteiro positivo").max(8, "O número de parcelas deve ser no máximo 8"),
    installment_value: z.number().positive("O valor da parcela deve ser positivo"),
    tax: z.number().min(0, "A taxa deve ser um número positivo ou zero"),
    observation: z.string().optional(),
    type: z.enum(["tax", "installment"]),
    payment_dates: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof schema>;

const Simulator = () => {
    const { showLoader, hideLoader } = useLoader();
    const [customers, setCustomers] = useState<ICustomerListItem[]>([]);
    const [calculationResult, setCalculationResult] = useState<any | null>(null);
    const [tableData, setTableData] = useState<any[]>([]);

    const {
        register,
        control,
        watch,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            customer_id: "",
            initial_date: new Date().toISOString().split("T")[0],
            value: null,
            installments: 2,
            installment_value: 0,
            tax: 20,
            observation: "",
            payment_dates: [],
            type: "tax",
        }
    });

    const formValues = watch();

    console.log('resultado:', calculationResult);
    console.log(formValues);

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

    const onSubmit = (data: FormData) => {
        console.log('Simulação enviada:', data);
        // Aqui você pode adicionar a lógica para enviar os dados para o backend ou processá-los conforme necessário
    };

    const handleCalculationLoan = () => {
        const values = watch();

        console.log('Valores para cálculo:', values);

        const payment_dates: Date[] =
            formValues.payment_dates
                ?.map((date) => (date ? new Date(date) : null))
                .filter(Boolean) as Date[] || [];
        if (formValues.payment_dates?.length !== formValues.installments) {
            console.log('Datas de pagamento:', payment_dates, 'Número de parcelas:', formValues.installments);
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
                        <div className="mb-2">
                            <TaxBadge tax={20} taxByCustomer={!!formValues.customer_id} />
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
                    <div className=" md:mx-auto">
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
                    <div>
                        <InputPercentage
                            control={control}
                            label="Taxa de juros (%)"
                            name="tax"
                            errors={errors}
                        />
                    </div>
                    <div>
                        <InputQuantity
                            control={control}
                            label="Quantidade de parcelas"
                            name="installments"
                            errors={errors}
                        />
                    </div>
                    {/* {formValues.type === "installment" && ( */}
                    <div>
                        <InputCurrency
                            control={control}
                            label="Valor da parcela"
                            name="installment_value"
                            errors={errors}
                        />
                    </div>
                    {/* )} */}
                    <div>
                        <h2 className="text-lg text-primary mt-4 border-b border-secondary/50">Vencimentos</h2>
                    </div>
                    <div className="w-full bg-red-500">
                        {formValues.installments > 0 &&
                            Array.from({ length: formValues.installments }).map((_, index) => (
                                <div key={index} className="mb-4">
                                    <InputDate
                                        label={`Data da parcela ${index + 1}`}
                                        name={`payment_dates.${index}`}
                                        register={register}
                                        errors={errors}
                                    />
                                </div>
                            ))}
                    </div>
                </div>
                <div className="mt-8">
                    <Button size="full" type="button" onClick={() => handleCalculationLoan()}>
                        Simular
                    </Button>
                </div>
            </form>
            {calculationResult && (
                <div className="mt-8 mb-16 py-3 text-xl">
                    <h2 className="text-xl mb-4 ">Resultado da simulação:</h2>
                    {calculationResult ? (
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
                    ) : <p>Nenhum resultado</p>}
                </div>
            )}
        </Section >
    );
};

export default Simulator;