import Logo from "../../../assets/logo.svg"

const Loader = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-primary/80">
            <img
                src={Logo}
                alt="Carregando"
                className="animate-spin size-14"
            />
        </div>
    );
};

export default Loader;
