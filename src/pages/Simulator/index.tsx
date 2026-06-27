import { useEffect, useRef, useState } from "react";
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
import InputPercentage from "../../components/ui/Input/InputPercentage";
import { calculateByRate } from "../../utils/calculateInstallmentValue";
import {
    calculateByInstallment,
    calculateByVariableInstallments,
} from "../../utils/calculateTax";
import Table from "../../components/ui/Table";
import formatToCurrencyBRL from "../../utils/formatToCurrencyBRL";
import { formatDateBR } from "../../utils/formatDateBR";
import { LoanService } from "../../services/loan";
import IconButton from "../../components/ui/ButtonIcon";
import { PlusCircle, TrashIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { handleFormEnterNavigation } from "../../utils/handleFormEnterNavigation";

const schema = z.object({
    customer_id: z.string(),
    initial_date: z.string(),
    value: z.number().positive("O valor deve ser positivo").nullable(),
    installment_value: z
        .number()
        .min(0, "O valor da parcela deve ser positivo"),
    tax: z.number().min(0, "A taxa deve ser um número positivo ou zero"),
    observation: z.string().optional(),
    type: z.enum(["tax", "installment", "custom"]),
    payment_dates: z.array(z.string()).optional(),
    payment_values: z.array(z.number()).optional(),
});

type FormData = z.infer<typeof schema>;

type CalculationResult = {
    totalWithInterest: number;
    totalInterest: number;
    monthlyRate: number;
    installmentValue?: number;
    installmentValues?: number[];
};

const Simulator = () => {
    const navigate = useNavigate();
    const { showLoader, hideLoader } = useLoader();

    const resultRef = useRef<HTMLDivElement | null>(null);

    const [customers, setCustomers] = useState<ICustomerListItem[]>([]);
    const [calculationResult, setCalculationResult] =
        useState<CalculationResult | null>(null);
    const [tableData, setTableData] = useState<
        {
            installment: number;
            due_date: string;
            installmentValue: string;
        }[]
    >([]);

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
            payment_values: [],
            type: "tax",
        },
    });

    const formValues = watch();

    useEffect(() => {
        const fetchCustomers = async () => {
            showLoader();

            try {
                const customers = await CustomerService.getCustomers();
                setCustomers(customers.customers);
            } catch (error) {
                console.error("Erro ao buscar clientes:", error);
            }

            hideLoader();
        };

        fetchCustomers();
    }, []);

    const onSubmit = async (data: FormData) => {
        if (!data.value) {
            return alert("Preencha o valor do empréstimo");
        }

        if (!calculationResult) {
            return alert("Simule o empréstimo antes de emprestar");
        }

        const paymentValues = formValues.payment_values || [];
        const isCustom = formValues.type === "custom";

        const obj = {
            customer_id: data.customer_id,
            original_value: data.value,
            loan_value: calculationResult.totalWithInterest * 100,
            loan_date: data.initial_date,
            tax: data.tax,
            installment_value: isCustom
                ? Math.round(
                      paymentValues.reduce((acc, value) => acc + value, 0) /
                          paymentValues.length
                  )
                : data.installment_value,
            installments:
                formValues.payment_dates?.map((date, index) => ({
                    ref: index + 1,
                    due_date: date,
                    ...(isCustom
                        ? { installment_value: paymentValues[index] }
                        : {}),
                })) || [],
            observation: data.observation,
        };

        try {
            showLoader();

            await LoanService.createLoan(obj);

            navigate(`/customers/${data.customer_id}`);
        } catch (error) {
            console.error("Erro ao criar empréstimo:", error);

            alert(
                "Ocorreu um erro ao criar o empréstimo. Por favor, tente novamente."
            );
        } finally {
            hideLoader();
        }
    };

    const handleCalculationLoan = () => {
        const values = watch();

        const payment_dates: Date[] =
            (formValues.payment_dates
                ?.map((date) => (date ? new Date(date) : null))
                .filter(Boolean) as Date[]) || [];

        if (
            formValues.payment_dates?.length !== payment_dates.length ||
            payment_dates.length === 0
        ) {
            alert("Preencha todas as datas das parcelas");
            return;
        }

        const loanDate = new Date(formValues.initial_date);
        const principal = (formValues.value || 0) / 100;

        if (!principal) {
            alert("Preencha o valor do empréstimo");
            return;
        }

        const installmentValue = (values.installment_value || 0) / 100;

        let result: CalculationResult | null = null;

        try {
            if (formValues.type === "tax") {
                result = calculateByRate(
                    principal,
                    formValues.tax / 100,
                    loanDate,
                    payment_dates
                );

                setValue(
                    "installment_value",
                    result.installmentValue! * 100
                );

                const tableDataResult =
                    formValues.payment_dates?.map((date, index) => ({
                        installment: index + 1,
                        due_date: formatDateBR(date),
                        installmentValue: result?.installmentValue
                            ? `${formatToCurrencyBRL(result.installmentValue)}`
                            : "—",
                    })) || [];

                setTableData(tableDataResult);
            } else if (formValues.type === "installment") {
                if (!installmentValue) {
                    alert("Preencha o valor da parcela");
                    return;
                }

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

                setTableData(tableDataResult);
            } else {
                const paymentValues = formValues.payment_values || [];

                if (paymentValues.length !== payment_dates.length) {
                    alert("Preencha o valor de todas as parcelas");
                    return;
                }

                const cashFlows = payment_dates.map((date, index) => {
                    const value = (paymentValues[index] || 0) / 100;

                    if (value <= 0) {
                        throw new Error(
                            "Todas as parcelas devem ter valor positivo"
                        );
                    }

                    return { value, date };
                });

                result = calculateByVariableInstallments(
                    principal,
                    loanDate,
                    cashFlows
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
                        installmentValue: `${formatToCurrencyBRL(
                            cashFlows[index].value
                        )}`,
                    })) || [];

                setTableData(tableDataResult);
            }
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Não foi possível calcular a simulação";

            alert(message);
            return;
        }

        setCalculationResult(result);

        setTimeout(() => {
            resultRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }, 100);
    };

    const handleAddInstallment = () => {
        const currentDates = getValues("payment_dates") || [];
        const currentValues = getValues("payment_values") || [];

        setValue("payment_dates", [...currentDates, ""], {
            shouldDirty: true,
        });
        setValue("payment_values", [...currentValues, 0], {
            shouldDirty: true,
        });
    };

    const handleRemoveInstallment = (index: number) => {
        const currentDates = getValues("payment_dates") || [];
        const currentValues = getValues("payment_values") || [];

        setValue(
            "payment_dates",
            currentDates.filter((_: string, i: number) => i !== index),
            { shouldDirty: true }
        );
        setValue(
            "payment_values",
            currentValues.filter((_: number, i: number) => i !== index),
            { shouldDirty: true }
        );
    };

    const isSimulateDisabled =
        !!formValues.payment_dates?.some((item) => !item) ||
        (formValues.type === "custom" &&
            (formValues.payment_values?.length !==
                formValues.payment_dates?.length ||
                formValues.payment_values?.some((value) => !value)));

    return (
        <Section title="Simulador">
            <form
                onSubmit={handleSubmit(onSubmit)}
                onKeyDown={handleFormEnterNavigation}
                className="flex flex-col gap-6"
            >
                <InputSelect
                    control={control}
                    label="Cliente"
                    name="customer_id"
                    options={customers.map((customer) => ({
                        label: customer.name,
                        value: customer.uuid,
                    }))}
                    errors={errors}
                    placeholder="Selecione um cliente"
                />

                <InputDate
                    label="Data empréstimo"
                    name="initial_date"
                    register={register}
                    errors={errors}
                />

                <div className="grid grid-cols-2 gap-3">
                    <InputCurrency
                        control={control}
                        label="Valor"
                        name="value"
                        errors={errors}
                    />

                    <InputSelect
                        control={control}
                        label="Tipo"
                        name="type"
                        options={[
                            { label: "Taxa", value: "tax" },
                            {
                                label: "Parcela definida",
                                value: "installment",
                            },
                            {
                                label: "Parcelas personalizadas",
                                value: "custom",
                            },
                        ]}
                        errors={errors}
                    />
                </div>

                {formValues.type === "tax" && (
                    <div className="flex flex-col gap-4">
                        <TaxBadge
                            fullWidth
                            tax={
                                customers.find(
                                    (item) =>
                                        item.uuid === watch("customer_id")
                                )?.averageTax || 20
                            }
                            taxByCustomer={
                                !!formValues.customer_id &&
                                !!customers.find(
                                    (item) =>
                                        item.uuid === watch("customer_id")
                                )?.averageTax
                            }
                        />

                        <InputPercentage
                            control={control}
                            label="Taxa de juros (%)"
                            name="tax"
                            errors={errors}
                        />
                    </div>
                )}

                {formValues.type === "installment" && (
                    <InputCurrency
                        control={control}
                        label="Valor da parcela"
                        name="installment_value"
                        errors={errors}
                    />
                )}

                <div className="flex flex-col gap-4">
                    <h2 className="section-title">
                        Vencimentos
                    </h2>

                    {formValues.payment_dates &&
                        formValues.payment_dates.length > 0 && (
                        <div className="flex flex-col divide-y divide-primary/10">
                        {Array.from({
                            length: formValues.payment_dates.length,
                        }).map((_, index) => (
                            <div
                                key={index}
                                className="flex items-end justify-between gap-3 py-4 first:pt-0 last:pb-0"
                            >
                                <div
                                    className={`grid min-w-0 flex-1 gap-3 ${
                                        formValues.type === "custom"
                                            ? "grid-cols-1 sm:grid-cols-2"
                                            : "grid-cols-1"
                                    }`}
                                >
                                    <InputDate
                                        label={`Data da parcela ${index + 1}`}
                                        name={`payment_dates.${index}`}
                                        register={register}
                                        errors={errors}
                                    />

                                    {formValues.type === "custom" && (
                                        <InputCurrency
                                            control={control}
                                            label={`Valor parcela ${index + 1}`}
                                            name={`payment_values.${index}`}
                                            errors={errors}
                                        />
                                    )}
                                </div>

                                <div className="mb-1 flex min-h-12 w-10 shrink-0 items-center justify-end">
                                    {index > 0 && (
                                        <IconButton
                                            variant="destructive"
                                            label="Remover parcela"
                                            icon={<TrashIcon />}
                                            onClick={() =>
                                                handleRemoveInstallment(index)
                                            }
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                        </div>
                        )}

                    <div className="flex justify-center pt-1">
                        <Button
                            type="button"
                            data-form-action="add"
                            className="flex items-center gap-2"
                            variant="link_primary"
                            onClick={handleAddInstallment}
                        >
                            <PlusCircle />
                            Adicionar parcela
                        </Button>
                    </div>
                </div>

                <Button
                    size="full"
                    type="button"
                    data-form-action="primary"
                    disabled={isSimulateDisabled}
                    onClick={() => handleCalculationLoan()}
                >
                    Simular
                </Button>

                {calculationResult && (
                    <div
                        ref={resultRef}
                        className="flex flex-col gap-4 pb-8"
                    >
                        <h2 className="section-title">
                            Resultado da simulação
                        </h2>

                        <div className="rounded-xl border border-primary/10 bg-white p-4 shadow-sm">
                            <p className="text-sm text-text/70 sm:text-base">
                                Valor total a pagar:{" "}
                                <strong className="text-base text-primary">
                                    {formatToCurrencyBRL(
                                        calculationResult.totalWithInterest
                                    )}
                                </strong>
                            </p>

                            <p className="mt-2 text-sm text-text/70 sm:text-base">
                                Valor total de juros:{" "}
                                <strong className="text-base text-primary">
                                    {formatToCurrencyBRL(
                                        calculationResult.totalInterest
                                    )}
                                </strong>
                            </p>

                            <p className="mt-2 text-sm text-text/70 sm:text-base">
                                Taxa mensal:{" "}
                                <strong className="text-base text-primary">
                                    {calculationResult.monthlyRate}%
                                </strong>
                            </p>
                        </div>

                        <Table
                            columns={[
                                {
                                    header: "Parcela",
                                    accessor: "installment",
                                },
                                {
                                    header: "Vencimento",
                                    accessor: "due_date",
                                },
                                {
                                    header: "Valor",
                                    accessor: "installmentValue",
                                },
                            ]}
                            data={tableData}
                        />
                    </div>
                )}

                {calculationResult && formValues.customer_id && (
                    <Button
                        size="full"
                        type="submit"
                        variant="secondary"
                        className="mt-2"
                    >
                        Emprestar
                    </Button>
                )}
            </form>
        </Section>
    );
};

export default Simulator;
