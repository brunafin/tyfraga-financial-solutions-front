import { useEffect, useState } from "react";
import type { ICustomerListItem } from "../Customers/types";
import { CustomerService } from "../../services/customer";
import Section from "../../components/ui/Section";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import calculatorLoan from "../../utils/calculatorLoan";
import Button from "../../components/ui/Button";

const schema = z.object({
    customer_id: z.string(),
    value: z.number().positive("O valor deve ser positivo"),
    payment_type: z.enum(["only", "weekly", "biweekly", "monthly"], "O tipo de pagamento é obrigatório"),
    installments: z.number().int().positive("O número de parcelas deve ser um inteiro positivo").max(8, "O número de parcelas deve ser no máximo 8"),
    tax: z.number().min(0, "A taxa deve ser um número positivo ou zero"),
    discount: z.number().min(0, "O desconto deve ser um número positivo ou zero"),
    observation: z.string().optional(),
});

const paymentType = [
    { value: "only", label: "Único" },
    { value: "weekly", label: "Semanal" },
    { value: "biweekly", label: "Quinzenal" },
    { value: "monthly", label: "Mensal" },
]

type FormData = z.infer<typeof schema>;

const Simulator = () => {
    const [list, setList] = useState<ICustomerListItem[]>([]);
    const [calculationResult, setCalculationResult] = useState<{ total: number; installmentValue: number } | null>(null);

    const {
        register,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            customer_id: "",
            value: 0,
            payment_type: "weekly",
            installments: 1,
            tax: 10,
            discount: 0,
            observation: "",
        }
    });

    const formValues = watch();

    const allFieldsFilled = formValues.value && formValues.installments && formValues.tax;

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const customers = await CustomerService.getCustomers();
                setList(customers.customers);
            } catch (error) {
                console.error('Erro ao buscar clientes:', error);
            }
        };

        fetchCustomers();
    }, [])

    const onSubmit = (data: FormData) => {
        console.log('Simulação enviada:', data);
        // Aqui você pode adicionar a lógica para enviar os dados para o backend ou processá-los conforme necessário
    };

    const handleCalculationLoan = () => {
        const result = calculatorLoan(
            formValues.value,
            formValues.installments,
            formValues.tax,
            formValues.discount,
        );
        setCalculationResult(result);
    }

    return (
        <Section title="Simulador">
            <form onSubmit={handleSubmit(onSubmit)}>
                <label className="flex flex-col gap-1 mb-4">
                    Cliente
                    <select
                        {...register("customer_id")}
                        className="border border-gray-300 rounded-md p-2"
                    >
                        <option value="">Selecione um cliente</option>
                        {list.map((customer) => (
                            <option key={customer.uuid} value={customer.uuid}>
                                {customer.name}
                            </option>
                        ))}
                    </select>
                    {errors.customer_id && (
                        <span className="text-red-500 text-sm">
                            {errors.customer_id.message}
                        </span>
                    )}
                </label>
                <label className="flex flex-col gap-1  mb-4">
                    Valor
                    <input
                        {...register("value")}
                        type="number"
                        className="border border-gray-300 rounded-md p-2"
                    />
                    {errors.value && (
                        <span className="text-red-500 text-sm">
                            {errors.value.message}
                        </span>
                    )}
                </label>
                <label className="flex flex-col gap-1 mb-4">
                    Forma de pagamento
                    <select
                        {...register("payment_type")}
                        className="border border-gray-300 rounded-md p-2"
                    >
                        {paymentType.map((payment) => (
                            <option key={payment.value} value={payment.value}>
                                {payment.label}
                            </option>
                        ))}
                    </select>
                    {errors.payment_type && (
                        <span className="text-red-500 text-sm">
                            {errors.payment_type.message}
                        </span>
                    )}
                </label>
                <label className="flex flex-col gap-1 mb-4">
                    Quantidade de parcelas
                    <input
                        {...register("installments", { valueAsNumber: true })}
                        type="number"
                        className="border border-gray-300 rounded-md p-2"
                    />
                    {errors.installments && (
                        <span className="text-red-500 text-sm">
                            {errors.installments.message}
                        </span>
                    )}
                </label>
                <label className="flex flex-col gap-1 mb-4">
                    Taxa
                    <input
                        {...register("tax")}
                        type="number"
                        className="border border-gray-300 rounded-md p-2"
                    />
                    {errors.tax && (
                        <span className="text-red-500 text-sm">
                            {errors.tax.message}
                        </span>
                    )}
                </label>
                <label className="flex flex-col gap-1 mb-4">
                    Desconto
                    <input
                        {...register("discount")}
                        type="text"
                        className="border border-gray-300 rounded-md p-2"
                    />
                    {errors.discount && (
                        <span className="text-red-500 text-sm">
                            {errors.discount.message}
                        </span>
                    )}
                </label>
                <label className="flex flex-col gap-1 mb-4">
                    Observação
                    <input
                        {...register("observation")}
                        type="text"
                        className="border border-gray-300 rounded-md p-2"
                    />
                    {errors.observation && (
                        <span className="text-red-500 text-sm">
                            {errors.observation.message}
                        </span>
                    )}
                </label>
                <Button size="full" type="button" disabled={!allFieldsFilled} onClick={() => handleCalculationLoan()}>
                    Simular
                </Button>
            </form>
            {calculationResult && (
                <div className="my-4 p-4 border border-gray-300 rounded-md">
                    <p><strong>Total a pagar:</strong> R$ {calculationResult.total.toFixed(2)}</p>
                    <p><strong>Valor da parcela:</strong> R$ {calculationResult.installmentValue.toFixed(2)}</p>
                </div>
            )}
        </Section>
    );
};

export default Simulator;