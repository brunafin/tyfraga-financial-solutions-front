import { NavLink, useParams } from "react-router";
import Section from "../../../components/ui/Section";
import { useEffect, useState } from "react";
import { CustomerService } from "../../../services/customer";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../../components/ui/Button";
import InputText from "../../../components/ui/Input/InputText";
import InputPhone from "../../../components/ui/Input/InputPhone";
import IconButton from "../../../components/ui/ButtonIcon";
import { ChevronRight, Pencil } from "lucide-react";
import TaxBadge from "../../../components/ui/TaxBadge";
import formatCentsToRealBRL from "../../../utils/formatCentsToRealBRL";
import { useLoader } from "../../../contexts/Loader/useLoader";
import { formatDateTimeBR } from "../../../utils/formatDateTimetoBr";

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
    profit: number;
    profit_pending: number;
    loans:
    {
        // id: number;
        uuid: string;
        tax: number;
        // original_value: number;
        loan_value: number;
        loan_date: string;
        status: 'paid' | 'pending' | 'overdue';
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

    if (loading) {
        return (
            <></>
        )
    }

    const getLoanStatus = (status: 'paid' | 'pending' | 'overdue') => {
        switch (status) {
            case 'paid':
                return 'border-l-4 border-green-600';
            case 'overdue':
                return 'border-l-4 border-red-600';
            case 'pending':
                return 'border-l-4 border-amber-500';
            default:
                return '';
        }
    }

    return (
        <Section
            title="Detalhes do Cliente"
            goBack
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
                    <div className="flex gap-2">
                        <Button variant="outline_primary" onClick={() => {
                            reset({
                                name: customer?.name || "",
                                phone: customer?.phone || "",
                            });
                            setIsEdit(false)
                        }}>Cancelar</Button>
                        <Button variant="primary" type="submit">Salvar</Button>
                    </div>
                </form>
            ) : (
                <div className="text-primary flex items-center justify-between w-fulljustify-between w-full">
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold">{watch('name')}</h2>
                        <a
                            href={`https://wa.me/+55${watch('phone')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                        >
                            ({watch('phone')})
                        </a>
                    </div>
                    {
                        !isEdit && (

                            <IconButton variant="primary" onClick={() => setIsEdit(true)} icon={<Pencil size={18} />} label="Editar" />
                        )

                    }
                </div>
            )}
            {customer?.amount_loaned !== 0 ? (
                <>
                    <ul className="mt-4">
                        <li>Total Emprestado: {' '}

                            {formatCentsToRealBRL(customer?.amount_loaned || 0)}

                        </li>
                        <li>Total com juros: {' '}

                            {formatCentsToRealBRL(customer?.amount_interest_loaned || 0)}

                        </li>
                        <li className="mt-2">Total Recebido: {' '}

                            {formatCentsToRealBRL(customer?.amount_received || 0)}

                        </li>
                        <li>Total lucro: {' '}
                            {formatCentsToRealBRL(customer?.profit || 0)}
                        </li>
                        {customer?.amount_pending_receive !== 0 && (
                            <li className="flex flex-col p-3 mt-3 w-full rounded-lg bg-white items-center">Valor pendente
                                <strong>{formatCentsToRealBRL(customer?.amount_pending_receive || 0)}</strong>
                                <span className="text-sm">{formatCentsToRealBRL(customer?.profit_pending || 0)} (lucro)</span>
                            </li>
                        )}
                        {/* <li className="mt-2">
                    <TaxBadge tax={customer?.average_tax || 0} taxByCustomer />
                </li> */}
                    </ul>
                    <section className="mt-12 mb-20">
                        <div className="flex items-center justify-between">
                            <h2 className="py-2 text-primary text-lg">Empréstimos</h2>
                            <TaxBadge tax={customer?.average_tax || 0} taxByCustomer />
                        </div>
                        {/* <Table
                    columns={[
                        { header: "ID", accessor: "id" },
                        { header: "Emprestado", accessor: "original_value" },
                        { header: "Cobrado", accessor: "loan_value" },
                        {
                            header: "Status", accessor: "status", render: (value) => (value === true
                                ? <Check className="text-secondary" size={18} />
                                : <Clock className="text-primary/50" size={18} />)
                        },
                    ]}
                    data={customer?.loans.map((item) => ({
                        id: item.id,
                        original_value: formatCentsToRealBRL(item.original_value) || "",
                        loan_value: formatCentsToRealBRL(item.loan_value) || "",
                        status: item.status,
                    })) || []}
                /> */}
                        <ul>
                            {customer?.loans.map((loan) => (
                                <li key={loan.uuid} className={`${getLoanStatus(loan.status)} bg-white p-2 shadow-sm rounded-md mb-2`}>
                                    <NavLink to={`/loans/${loan.uuid}`} className="flex justify-between items-center text-primary/90 rounded-md p-2">
                                        {/* {loan.status ? <Check className="text-secondary" size={18} /> : <Clock className="text-primary/80" size={18} />} */}
                                        {formatDateTimeBR(loan.loan_date)} - {formatCentsToRealBRL(loan.loan_value)}
                                        <ChevronRight className="text-primary/50" />
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </section>
                </>
            ) : (
                <p className="py-4 px-2">Nenhum valor emprestado.</p>
            )}
            {/* <Button variant="destructive" size="full" onClick={handleDelete}>
                Excluir cliente
            </Button> */}
        </Section>
    )
}

export default Details;