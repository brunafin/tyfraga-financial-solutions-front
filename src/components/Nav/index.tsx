import { CalculatorIcon, CreditCardIcon, UsersIcon } from "@heroicons/react/24/outline"
import { NavLink } from "react-router"

const Nav = () => {
    return (
        <nav className="bg-white h-[10vh] shadow absolute w-full bottom-1 p-3">
            <ul className="flex gap-4 justify-around">
                <li>
                    <NavLink to="/customers" className="text-gray-700 hover:text-gray-900 text-sm flex flex-col items-center">
                        <UsersIcon className="text-gray-500 w-6" /> Clientes
                    </NavLink>
                </li>
                <div className="border-2 border-gray-200"/>
                <li>
                    <NavLink to="/simulator" className="text-gray-700 hover:text-gray-900 text-sm flex flex-col items-center">
                        <CalculatorIcon className="text-gray-500 w-6" /> Simulador
                    </NavLink>
                </li>
                <div className="border-2 border-gray-200"/>
                <li>
                    <NavLink to="/loans" className="text-gray-700 hover:text-gray-900 text-sm flex flex-col items-center">
                        <CreditCardIcon className="text-gray-500 w-6" /> Empréstimos
                    </NavLink>
                </li>
            </ul>
        </nav>
    )
}

export default Nav