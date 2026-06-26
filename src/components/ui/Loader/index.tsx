import Logo from "../../../assets/logo.png"

const Loader = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-primary/80">
           <img src={Logo} alt="Carregando" className="animate-spin w-16 h-16" />
        </div>
    );
};

export default Loader;
