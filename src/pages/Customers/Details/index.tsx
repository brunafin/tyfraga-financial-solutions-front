import { NavLink, useNavigate, useParams } from "react-router";
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
import { Eye } from "lucide-react";
import ButtonNavLink from "../../../components/ui/ButtonNavLink";
import TaxBadge from "../../../components/ui/TaxBadge";

const schema = z.object({
    name: z.string().min(1, "O nome é obrigatório"),
    phone: z
        .string()
        .min(1, "O telefone é obrigatório")
        .regex(/^\d{10,11}$/, "O telefone deve conter 10 ou 11 dígitos"),
});

type FormData = z.infer<typeof schema>;

const Details = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [, setIsEdit] = useState(false);
    const {
        register,
        control,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const handleDelete = async () => {
        if (!id) return;
        try {
            await CustomerService.deleteCustomer(id);
            alert("Cliente excluído com sucesso!");
            navigate("/customers");
        } catch (error) {
            console.error('Erro ao excluir cliente:', error);
            alert("Ocorreu um erro ao excluir o cliente.");
        }
    }

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
        try {
            const customer = await CustomerService.getCustomerById(id!);
            reset({
                name: customer.name,
                phone: customer.phone,
            });
        } catch (error) {
            console.error('Erro ao buscar cliente:', error);
        }
    };

    useEffect(() => {
        if (id) {
            fetchCustomerById();
        }
    }, [id])

    return (
        <Section
            title="Detalhes do Cliente"
            action={
                <Button variant="destructive" onClick={() => handleDelete()}>Excluir cliente</Button>

            }
        >
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 my-4">
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

                <div className="flex justify-end gap-4 fixed bottom-0 left-0 w-full px-8 py-4 bg-white">
                    <NavLink to="/customers">
                        <Button variant="outline_primary">Cancelar</Button>
                    </NavLink>
                    <Button type="submit">Salvar cliente</Button>
                </div>
            </form>

            <h2 className="mt-12 pt-3 text-primary
             text-2xl border-t border-primary/20">Histórico de pagamentos</h2>
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
            <div className="mt-8">
                <div className="flex flex-col gap-3">
                    {/* <div className=" flex flex-col bg-secondary/20 rounded-sm p-2">
                            <p>Taxa média mensal: 20%</p>
                            <p>Tempo:26 dias</p>
                            <p>Observação: cobrar sempre na segunda-feira</p>
                        </div> */}

                    {/* Aqui entra sua tabela */}
                    <Table
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
            </div>
            <section className="border-t border-primary/20 mt-12">
                <div className="flex justify-between items-end mb-8">
                    <div className="flex items-end gap-2">
                    <h2 className="pt-3 text-primary text-2xl">Empréstimos</h2>
                    <TaxBadge tax={20} taxByCustomer/>
                    </div>
                    <ButtonNavLink to="/loans" variant="outline_primary" className="mt-4">
                        Ver todos os empréstimos
                    </ButtonNavLink>
                </div>
                <Table
                    columns={[
                        { header: "Número", accessor: "name" },
                        { header: "Valor emprestado", accessor: "amount_borrowed" },
                        { header: "Valor cobrado", accessor: "amount_charged" },
                        { header: "Total de parcelas", accessor: "installments_total" },
                        { header: "Parcelas restantes", accessor: "installments_missing" },
                        {
                            header: "Ações", accessor: "name", render: (_) => (
                                <div className="flex justify-end gap-2">
                                    <IconButton
                                        icon={<Eye size={16} />}
                                        label="Detalhes do empréstimo"
                                    />
                                </div>
                            ),
                        },
                    ]}
                    data={[
                        { id: 1, name: "1", amount_borrowed: "600,00", amount_charged: "720,00", installments_total: "6", installments_missing: "4" },
                    ]}
                />
            </section>
        </Section>
    )
}

export default Details;