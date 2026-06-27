import { NavLink } from "react-router";

const Config = () => {
  return (
    <div className="p-4">
      <h1 className="content-heading mb-4">Configurações</h1>
      <p className="text-sm text-text/70 sm:text-base">Esta página é destinada a configurações gerais do sistema. Aqui você pode ajustar preferências, gerenciar integrações e configurar outras opções relacionadas ao funcionamento do sistema.</p>
      <NavLink to="/config/ui" className="underline">
      Componentes do sistema
      </NavLink>
    </div>
  );
};

export default Config;