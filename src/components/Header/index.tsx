import { CurrencyDollarIcon } from "@heroicons/react/16/solid"
import { NavLink } from "react-router"

const Header = () => {
    return (
        <header className="bg-white flex items-center h-[10vh] p-3">
            <NavLink to="/" className='flex items-center gap-2'>
                <CurrencyDollarIcon className='w-12 text-red-600' />
                <h1 className="flex flex-col">
                    <span className="text-gray-600 font-bold">TyFraga</span>
                    <span className="text-gray-800">Soluções Financeiras</span>
                </h1>
            </NavLink>
        </header>
    )
}

export default Header