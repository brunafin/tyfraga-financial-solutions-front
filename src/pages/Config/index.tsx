import { NavLink } from "react-router";

const Config = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Configurações</h1>
      <p>Esta página é destinada a configurações gerais do sistema. Aqui você pode ajustar preferências, gerenciar integrações e configurar outras opções relacionadas ao funcionamento do sistema.</p>
      <NavLink to="/config/ui" className="underline">
      Componentes do sistema
      </NavLink>
    </div>
  );
};

export default Config;