import { CurrencyDollarIcon } from "@heroicons/react/16/solid";

const Loader = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900/80">
           <CurrencyDollarIcon className='w-20 bg-white rounded-full text-red-600 animate-spin' />
        </div>
    );
};

export default Loader;