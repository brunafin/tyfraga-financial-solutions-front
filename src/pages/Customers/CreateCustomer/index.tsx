import { NavLink, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Section from "../../../components/ui/Section";
import Button from "../../../components/ui/Button";
import { CustomerService } from "../../../services/customer";
import InputText from "../../../components/ui/Input/InputText";
import InputPhone from "../../../components/ui/Input/InputPhone";


const schema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  phone: z
    .string()
    .min(1, "O telefone é obrigatório")
    .regex(/^\d{10,11}$/, "O telefone deve conter 10 ou 11 dígitos"),
});

type FormData = z.infer<typeof schema>;

const CreateCustomer = () => {
  const navigate = useNavigate();
  const {
    register,
    control,
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
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:w-3/4 gap-3">

        {/* Nome */}
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

        <div className="flex justify-end gap-3 w-full mt-8">
          <NavLink to="/customers">
            <Button variant="outline_primary">Cancelar</Button>
          </NavLink>
          <Button type="submit">Salvar cliente</Button>
        </div>
      </form>
    </Section>
  );
};

export default CreateCustomer;