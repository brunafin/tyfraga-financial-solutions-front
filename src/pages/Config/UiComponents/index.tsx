import { useState } from "react";
import { useForm } from "react-hook-form";

import Header from "../../../components/Header";
import Nav from "../../../components/Nav";
import Button from "../../../components/ui/Button";
import Loader from "../../../components/ui/Loader";
import Section from "../../../components/ui/Section";
import TaxBadge from "../../../components/ui/TaxBadge";
import Title from "../../../components/ui/Title";
import InputText from "../../../components/ui/Input/InputText";
import InputDate from "../../../components/ui/Input/InputDate";
import InputCurrency from "../../../components/ui/Input/InputCurrency";
import InputPercentage from "../../../components/ui/Input/InputPercentage";
import InputQuantity from "../../../components/ui/Input/InputQuantity";
import InputRadio from "../../../components/ui/Input/InputRadio";
import InputSelect from "../../../components/ui/Input/InputSelect";
import { Pencil, Trash } from "lucide-react";
import IconButton from "../../../components/ui/ButtonIcon";
import Table from "../../../components/ui/Table";
import Accordion from "../../../components/ui/Accordion";

const UiComponents = () => {
    const [showLoader, setShowLoader] = useState(false);

    const { register, control, formState: { errors } } = useForm({
        defaultValues: {
            exemplo: "",
            date: "",
            price: 0
        }
    });

    const handleShowLoader = () => {
        setShowLoader(true);
        setTimeout(() => {
            setShowLoader(false);
        }, 1000);
    };

    return (
        <Section title="Componentes do sistema">
            <div className="my-8">
                <h3 className="mb-2">Header</h3>
                <Header />
            </div>

            <div className="mb-8">
                <h3 className="mb-2">Título</h3>
                <Title>Exemplo de título</Title>
            </div>

            <div className="mb-8">
                <h3 className="mb-2">Menu</h3>
                <Nav />
            </div>

            <div className="mb-8">
                <h3 className="mb-2">Botões</h3>
                <Button variant="primary">Botão primário</Button>
                <Button variant="outline_primary">Botão primário</Button>
                <Button variant="link_primary">Botão primário</Button>

                <Button variant="primary" size="full">Botão primário</Button>
                <Button variant="outline_primary" size="full">Botão primário</Button>
                <Button variant="link_primary" size="full">Botão primário</Button>

                <Button variant="secondary">Botão secundário</Button>
                <Button variant="outline_secondary">Botão secundário</Button>
                <Button variant="link_secondary">Botão secundário</Button>

                <Button variant="secondary" size="full">Botão secundário</Button>
                <Button variant="outline_secondary" size="full">Botão secundário</Button>
                <Button variant="link_secondary" size="full">Botão secundário</Button>

                <Button variant="destructive">Botão destrutivo</Button>
                <IconButton
                    icon={<Pencil size={18} />}
                    label="Editar"
                    variant="primary"
                />

                <IconButton
                    icon={<Trash size={18} />}
                    label="Excluir"
                    variant="destructive"
                />
            </div>

            <div className="mb-8">
                <h3 className="mb-2">Badge de taxa</h3>
                <TaxBadge tax={1.5} />
                <TaxBadge tax={1.5} taxByCustomer />
            </div>

            <div className="mb-8">
                <h3 className="mb-2">Loader</h3>
                <Button onClick={handleShowLoader}>Mostrar Loader</Button>
                {showLoader && <Loader />}
            </div>

            <div className="mb-8 flex flex-col gap-4">
                <h3 className="mb-2">Inputs</h3>

                <InputText
                    label="Exemplo de input de texto"
                    name="exemplo"
                    register={register}
                    errors={errors}
                />

                <InputDate
                    label="Exemplo de input de data"
                    name="date"
                    register={register}
                    errors={errors}
                />

                <InputCurrency
                    label="Valor moeda"
                    name="price"
                    control={control}
                    errors={errors}
                />

                <InputPercentage
                    label="Valor porcentagem"
                    name="percentage"
                    control={control}
                    errors={errors}
                />

                <InputQuantity
                    label="Quantidade"
                    name="quantity"
                    control={control}
                    errors={errors}
                />
                <InputRadio
                    label="Tipo de taxa"
                    name="taxType"
                    control={control}
                    options={[
                        { label: "Taxa", value: "tax" },
                        { label: "Parcela definida", value: "installment" },
                    ]}
                    errors={errors}
                    inline
                />
                <InputSelect
                    label="Categoria"
                    name="category"
                    control={control}
                    options={[
                        { label: "Alimentação", value: "food" },
                        { label: "Transporte", value: "transport" },
                        { label: "Outros", value: "other" },
                    ]}
                    errors={errors}
                />

                {/* disabled */}
                <InputText
                    label="Exemplo de input de texto"
                    name="exemplo"
                    register={register}
                    errors={errors}
                    disabled
                />

                <InputDate
                    label="Exemplo de input de data"
                    name="date"
                    register={register}
                    errors={errors}
                    disabled
                />

                <InputCurrency
                    label="Valor moeda"
                    name="price"
                    control={control}
                    errors={errors}
                    disabled
                />

                <InputPercentage
                    label="Valor porcentagem"
                    name="percentage"
                    control={control}
                    errors={errors}
                    disabled
                />

                <InputQuantity
                    label="Quantidade"
                    name="quantity"
                    control={control}
                    errors={errors}
                    disabled
                />
                <InputRadio
                    label="Tipo de taxa"
                    name="taxType"
                    control={control}
                    options={[
                        { label: "Taxa", value: "tax" },
                        { label: "Parcela definida", value: "installment" },
                    ]}
                    errors={errors}
                    inline
                    disabled
                />
                <InputSelect
                    label="Categoria"
                    name="category"
                    control={control}
                    options={[
                        { label: "Alimentação", value: "food" },
                        { label: "Transporte", value: "transport" },
                        { label: "Outros", value: "other" },
                    ]}
                    errors={errors}
                    disabled
                />
            </div>
            <div className="mb-8">
                <h3 className="mb-2">Tabela</h3>
                <Table
                    columns={[
                        { header: "Nome", accessor: "name" },
                        { header: "Valor", accessor: "price" },
                        {
                            header: "Ações",
                            accessor: "id",
                            render: (_, row) => (
                                <div className="flex justify-end gap-2">
                                    <IconButton
                                        icon={<Pencil size={16} />}
                                        label="Editar"
                                    />
                                    <IconButton
                                        icon={<Trash size={16} />}
                                        label="Excluir"
                                        variant="destructive"
                                    />
                                </div>
                            ),
                        },
                    ]}
                    data={[
                        { id: 1, name: "Produto A", price: 100 },
                        { id: 2, name: "Produto B", price: 200 },
                    ]}
                />
            </div>
            <div className="mb-8">
                <h3 className="mb-2">Accordion</h3>
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
                        <div className="text-sm text-gray-600">
                            <strong>Taxa média mensal:</strong> 20% &nbsp;
                            <strong>Tempo:</strong> 26 dias
                        </div>

                        <div className="text-sm text-gray-600">
                            <strong>Observação:</strong> cobrar sempre na segunda-feira
                        </div>

                        {/* Aqui entra sua tabela */}
                        <Table
                            columns={[
                                { header: "Nome", accessor: "name" },
                                { header: "Valor", accessor: "price" },
                                {
                                    header: "Ações",
                                    accessor: "id",
                                    render: (_, row) => (
                                        <div className="flex justify-end gap-2">
                                            <IconButton
                                                icon={<Pencil size={16} />}
                                                label="Editar"
                                            />
                                            <IconButton
                                                icon={<Trash size={16} />}
                                                label="Excluir"
                                                variant="destructive"
                                            />
                                        </div>
                                    ),
                                },
                            ]}
                            data={[
                                { id: 1, name: "Produto A", price: 100 },
                                { id: 2, name: "Produto B", price: 200 },
                            ]}
                        />
                        <Button variant="destructive">Encerrar empréstimo</Button>
                    </div>
                </Accordion>
            </div>
        </Section>
    );
};

export default UiComponents;