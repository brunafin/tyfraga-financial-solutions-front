import { NavLink, redirect, useNavigate, useParams } from "react-router";
import Section from "../../../components/ui/Section";
import { useEffect, useState } from "react";
import { CustomerService } from "../../../services/customer";
import type { ICustomerListItem } from "../types";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../../components/ui/Button";
import { PencilIcon } from "@heroicons/react/24/outline";

const schema = z.object({
    name: z.string().min(1, "O nome é obrigatório"),
    phone: z
        .string()
        .min(1, "O telefone é obrigatório")
        .regex(/^\d{10,11}$/, "O telefone deve conter 10 ou 11 dígitos"),
    key_pix: z.string().min(1, "A chave Pix é obrigatória"),
    bond: z.string().min(1, "O vínculo é obrigatório"),
    trust_level: z.enum(["baixo", "médio", "alto", "não sei"], 'O nível de confiança é obrigatório'),
});

type FormData = z.infer<typeof schema>;

const Details = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isEdit, setIsEdit] = useState(false);
    const [customer, setCustomer] = useState<ICustomerListItem | null>(null);
    const {
        register,
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
                key_pix: data.key_pix,
                bond: data.bond,
                trust_level: data.trust_level,
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
            setCustomer(customer);
            reset({
                name: customer.name,
                phone: customer.phone,
                key_pix: customer.key_pix,
                bond: customer.bond,
                trust_level: customer.trust_level,
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
        <Section title="Detalhes do Cliente">
            <div className="flex items-center">
                <Button size="full" variant={isEdit ? 'outline' : 'primary'} onClick={() => setIsEdit((prev) => !prev)}>
                    <PencilIcon className="w-6" /> {isEdit ? "Cancelar edição" : "Editar"}
                </Button>
            </div>
            <div className="py-4">
                <p className="text-lg"><span className="font-bold me-2">Nome:</span>{customer?.name}</p>
                <p className="text-lg"><span className="font-bold me-2">Telefone:</span>{customer?.phone}</p>
                <p className="text-lg"><span className="font-bold me-2">Chave pix: </span>{customer?.key_pix}</p>
                <p className="text-lg"><span className="font-bold me-2">Vínculo: </span>{customer?.bond}</p>
                <p className="text-lg"><span className="font-bold me-2">Nível de confiança: </span>{customer?.trust_level}</p>
            </div>
            {isEdit && (
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 my-4">

                    {/* Nome */}
                    <label className="flex flex-col gap-1">
                        Nome
                        <input
                            {...register("name")}
                            type="text"
                            className="border border-gray-300 rounded-md p-2"
                        />
                        {errors.name && (
                            <span className="text-red-500 text-sm">
                                {errors.name.message}
                            </span>
                        )}
                    </label>

                    {/* Telefone */}
                    <label className="flex flex-col gap-1">
                        Telefone
                        <input
                            {...register("phone")}
                            type="text"
                            className="border border-gray-300 rounded-md p-2"
                        />
                        {errors.phone && (
                            <span className="text-red-500 text-sm">
                                {errors.phone.message}
                            </span>
                        )}
                    </label>

                    {/* Chave Pix */}
                    <label className="flex flex-col gap-1">
                        Chave Pix
                        <input
                            {...register("key_pix")}
                            type="text"
                            className="border border-gray-300 rounded-md p-2"
                        />
                        {errors.key_pix && (
                            <span className="text-red-500 text-sm">
                                {errors.key_pix.message}
                            </span>
                        )}
                    </label>

                    {/* Vínculo */}
                    <label className="flex flex-col gap-1">
                        Vínculo
                        <input
                            {...register("bond")}
                            type="text"
                            className="border border-gray-300 rounded-md p-2"
                        />
                        {errors.bond && (
                            <span className="text-red-500 text-sm">
                                {errors.bond.message}
                            </span>
                        )}
                    </label>

                    {/* Nível de confiança */}
                    <label className="flex flex-col gap-1 mb-4">
                        Nível de Confiança
                        <select
                            {...register("trust_level")}
                            className="border border-gray-300 rounded-md p-2"
                        >
                            <option value="">Selecione</option>
                            <option value="não sei">Não sei</option>
                            <option value="baixo">Baixo</option>
                            <option value="médio">Médio</option>
                            <option value="alto">Alto</option>
                        </select>
                        {errors.trust_level && (
                            <span className="text-red-500 text-sm">
                                {errors.trust_level.message}
                            </span>
                        )}
                    </label>

                    <Button size="full" type="submit">Salvar</Button>

                    <NavLink to="/customers">
                        <Button size="full" variant="outline">Cancelar</Button>
                    </NavLink>
                </form>
            )}
            <Button size="full" variant="outline_primary" onClick={() => handleDelete()}>Excluir cliente</Button>
        </Section>
    )
}

export default Details;