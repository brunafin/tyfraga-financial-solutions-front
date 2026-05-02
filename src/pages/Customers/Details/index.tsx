import { useParams } from "react-router";
import Section from "../../../components/ui/Section";
import { useEffect, useState } from "react";
import { CustomerService } from "../../../services/customer";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../../components/ui/Button";
import InputText from "../../../components/ui/Input/InputText";
import InputPhone from "../../../components/ui/Input/InputPhone";
import Table from "../../../components/ui/Table";
import IconButton from "../../../components/ui/ButtonIcon";
import { Pencil } from "lucide-react";
import TaxBadge from "../../../components/ui/TaxBadge";
import formatCentsToRealBRL from "../../../utils/formatCentsToRealBRL";
import { useLoader } from "../../../contexts/Loader/useLoader";

const schema = z.object({
    name: z.string().min(1, "O nome é obrigatório"),
    phone: z
        .string()
        .min(1, "O telefone é obrigatório")
        .regex(/^\d{10,11}$/, "O telefone deve conter 10 ou 11 dígitos"),
});

type FormData = z.infer<typeof schema>;

interface ICustomerDetail {
    uuid: string;
    name: string;
    phone: string;
    total_loans: number;
    amount_loaned: number;
    amount_received: number;
    amount_pending_receive: number;
    amount_interest_loaned: number;
    average_tax: number;
    loans:
    {
        id: string;
        tax: number;
        original_value: number;
        loan_value: number;
        status: string;
    }[];
}

const Details = () => {
    const { id } = useParams();
    const { showLoader, hideLoader, loading } = useLoader();
    const [customer, setCustomer] = useState<ICustomerDetail | null>(null);
    // const navigate = useNavigate();
    const [isEdit, setIsEdit] = useState(false);
    const {
        register,
        control,
        reset,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    // const handleDelete = async () => {
    //     if (!id) return;
    //     try {
    //         await CustomerService.deleteCustomer(id);
    //         alert("Cliente excluído com sucesso!");
    //         navigate("/customers");
    //     } catch (error) {
    //         console.error('Erro ao excluir cliente:', error);
    //         alert("Ocorreu um erro ao excluir o cliente.");
    //     }
    // }

    const onSubmit = async (data: FormData) => {
        try {
            await CustomerService.updateCustomer(id!, {
                name: data.name,
                phone: data.phone,
            });
            alert("Cliente atualizado com sucesso!");
            fetchCustomerById();
            setIsEdit(false);
        } catch (error) {
            console.error('Erro ao atualizar cliente:', error);
            alert("Ocorreu um erro ao atualizar o cliente.");
        }
    };

    const fetchCustomerById = async () => {
        showLoader();
        try {
            const customer = await CustomerService.getCustomerById(id!);
            reset({
                name: customer.name,
                phone: customer.phone,
            });
            setCustomer(customer);
        } catch (error) {
            console.error('Erro ao buscar cliente:', error);
        } finally {
            hideLoader();
        }
    };

    useEffect(() => {
        if (id) {
            fetchCustomerById();
        }
    }, [id])

        if(loading){
            return(
                <></>
            )
        }

    return (
        <Section
            title="Detalhes do Cliente"
            action={
                (isEdit) ? (
                    <div className="flex gap-2">
                        <Button variant="outline_primary" onClick={() => setIsEdit(false)}>Cancelar</Button>
                        <Button variant="primary" onClick={() => onSubmit(watch())}>Salvar</Button>
                    </div>
                ) : (
                    <IconButton variant="primary" onClick={() => setIsEdit(true)} icon={<Pencil size={18} />} label="Editar" />
                )

            }
        >
            {isEdit ? (
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 my-4 border-b border-primary/20 pb-4">
                    <div className="w-full md:w-1/2">
                        <InputText
                            label="Nome"
                            placeholder="Digite o nome do cliente"
                            name="name"
                            register={register}
                            errors={errors}
                        />
                    </div>

                    {/* Telefone */}
                    <div className="w-full md:w-1/2">
                        <InputPhone
                            label="Telefone"
                            name="phone"
                            control={control}
                            errors={errors}
                        />
                    </div>
                </form>
            ) : (
                <div className="text-primary">
                    <div className="flex items-center gap-2 mb-3">
                        <h2 className="text-xl font-bold">{watch('name')}</h2>
                        <a
                            href={`https://wa.me/${watch('phone')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                        >
                            ({watch('phone')})
                        </a>
                    </div>
                </div>
            )}
            <ul className="rounded-sm">
                <li>Empréstimos: {' '}
                    <strong className="font-bold">{customer?.total_loans}</strong>
                </li>
                <li>Valor Emprestado: {' '}
                    <strong className="font-bold">
                        {formatCentsToRealBRL(customer?.amount_loaned || 0)}
                    </strong>
                </li>
                <li>Valor Emprestado com juros: {' '}
                    <strong className="font-bold">
                        {formatCentsToRealBRL(customer?.amount_interest_loaned || 0)}
                    </strong>
                </li>
                <li>Valor Recebido: {' '}
                    <strong className="font-bold">
                        {formatCentsToRealBRL(customer?.amount_received || 0)}
                    </strong>
                </li>
                <li className="flex flex-col p-4 mt-6 border-l-4 border-amber-400 w-full rounded-lg shadow items-center">Valor pendente
                    <strong className="font-bold">
                        {formatCentsToRealBRL(customer?.amount_pending_receive || 0)}
                    </strong>
                </li>
                {/* <li className="mt-2">
                    <TaxBadge tax={customer?.average_tax || 0} taxByCustomer />
                </li> */}
            </ul>

            {/* 
            <h2 className="mt-8 pt-2 text-primary
             text-lg border-t border-primary/20">
                Histórico de pagamentos
            </h2> */}
            {/* <div className="mt-8">
                <Accordion
                    header={
                        <div className="flex justify-between items-center w-full">
                            <div className="flex gap-6">
                                <span>24/04/2026</span>
                                <span className="font-medium">R$ 1.000,00</span>
                            </div>

                            <span className="text-sm text-gray-500">Em dia</span>
                        </div>
                    }
                >
                    <div className="flex flex-col gap-3">
                        <div className="flex justify-end">
                            <ButtonNavLink to="/loans/1" variant="link_primary">
                                Ver detalhes do empréstimo
                            </ButtonNavLink>
                        </div>
                        <div className=" flex flex-col bg-secondary/20 rounded-sm p-2">
                            <p>Taxa média mensal: 20%</p>
                            <p>Tempo:26 dias</p>
                            <p>Observação: cobrar sempre na segunda-feira</p>
                        </div>
                        <Table
                            columns={[
                                { header: "Parcela", accessor: "name" },
                                { header: "Valor", accessor: "price" },
                                { header: "Data vencimento", accessor: "dueDate" },
                                { header: "Data pagamento", accessor: "paymentDate" },
                                { header: "Status", accessor: "status" },
                            ]}
                            data={[
                                { id: 1, name: "1", price: "600,00", dueDate: "01/05/2026", paymentDate: "30/04/2026", status: "Pago" },
                                { id: 2, name: "2", price: "600,00", dueDate: "01/06/2026", paymentDate: "30/05/2026", status: "Pendente" },
                                { id: 2, name: "2", price: "600,00", dueDate: "01/06/2026", paymentDate: "30/05/2026", status: "Pendente" },
                                { id: 2, name: "2", price: "600,00", dueDate: "01/06/2026", paymentDate: "30/05/2026", status: "Pendente" },
                                { id: 2, name: "2", price: "600,00", dueDate: "01/06/2026", paymentDate: "30/05/2026", status: "Pendente" },
                                { id: 2, name: "2", price: "600,00", dueDate: "01/06/2026", paymentDate: "30/05/2026", status: "Pendente" },
                                { id: 2, name: "2", price: "600,00", dueDate: "01/06/2026", paymentDate: "30/05/2026", status: "Pendente" },
                            ]}
                        />
                    </div>
                </Accordion>
            </div> */}
            {/* <div className="mt-4">
                <div className="flex flex-col gap-3"> */}
            {/* <div className=" flex flex-col bg-secondary/20 rounded-sm p-2">
                            <p>Taxa média mensal: 20%</p>
                            <p>Tempo:26 dias</p>
                            <p>Observação: cobrar sempre na segunda-feira</p>
                        </div> */}

            {/* Aqui entra sua tabela */}
            {/* <Table
                        columns={[
                            { header: "Parcela", accessor: "name" },
                            { header: "Valor", accessor: "price" },
                            { header: "Data vencimento", accessor: "dueDate" },
                            { header: "Data pagamento", accessor: "paymentDate" },
                        ]}
                        data={[
                            { id: 1, name: "1", price: "600,00", dueDate: "01/05/2026", paymentDate: "30/04/2026" },
                            { id: 1, name: "1", price: "600,00", dueDate: "01/05/2026", paymentDate: "30/04/2026" },
                            { id: 1, name: "1", price: "600,00", dueDate: "01/05/2026", paymentDate: "30/04/2026" },
                            { id: 1, name: "1", price: "600,00", dueDate: "01/05/2026", paymentDate: "30/04/2026" },
                            { id: 1, name: "1", price: "600,00", dueDate: "01/05/2026", paymentDate: "30/04/2026" },
                        ]}
                    />
                </div>
            </div> */}
            <section className="mt-12 mb-20">
                <div className="flex items-center justify-between">
                    <h2 className="py-2 text-primary text-lg">Empréstimos</h2>
                    <TaxBadge tax={customer?.average_tax || 0} taxByCustomer />
                </div>
                <Table
                    columns={[
                        { header: "ID", accessor: "id" },
                        { header: "Emprestado", accessor: "original_value" },
                        { header: "Cobrado", accessor: "loan_value" },
                        { header: "Status", accessor: "status" },
                    ]}
                    data={customer?.loans.map((item) => ({
                        id: item.id,
                        original_value: formatCentsToRealBRL(item.original_value) || "",
                        loan_value: formatCentsToRealBRL(item.loan_value) || "",
                        status: item.status,
                    })) || []}
                />
            </section>
            {/* <Button variant="destructive" size="full" onClick={handleDelete}>
                Excluir cliente
            </Button> */}
        </Section>
    )
}

export default Details;