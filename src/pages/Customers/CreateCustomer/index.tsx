import { NavLink, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Section from "../../../components/ui/Section";
import Button from "../../../components/ui/Button";
import { CustomerService } from "../../../services/customer";


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

const CreateCustomer = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await CustomerService.createCustomer({
        name: data.name,
        phone: data.phone,
        key_pix: data.key_pix,
        bond: data.bond,
        trust_level: data.trust_level,
      });
      alert("Cliente criado com sucesso!");
      navigate("/customers");
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      alert("Ocorreu um erro ao criar o cliente.");     
    }
  };

  return (
    <Section title="Novo Cliente">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        
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
    </Section>
  );
};

export default CreateCustomer;