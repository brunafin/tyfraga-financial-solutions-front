import Logo from "../../../assets/logo.svg"

const Loader = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900/80">
           <img src={Logo} className='animate-spin bg-white rounded-full' />
        </div>
    );
};

export default Loader;