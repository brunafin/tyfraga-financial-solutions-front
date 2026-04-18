import { BanknoteArrowUp, Calculator, ChartLine, Cog, HandCoins, User } from "lucide-react"
import { NavLink, useLocation } from "react-router"

const Nav = () => {
    const routeLocation = useLocation().pathname;
    return (
        <nav className="bg-primary sm:absolute sm:w-full sm:bottom-5 md:bg-primary md:w-20 md:h-full p-3">
            <ul className="flex md:flex-col gap-6 justify-around">
                {/* <li>
                    <NavLink to="/" className={`hover:bg-secondary hover:rounded-md p-3 flex justify-center ${routeLocation === '/' ? 'bg-secondary rounded-md' : ''}`}>
                        <ChartLine className="text-white w-6" />
                    </NavLink>
                </li> */}
                <li>
                    <NavLink to="/simulator" className={`hover:bg-secondary hover:rounded-md p-3 flex justify-center ${routeLocation === '/simulator' ? 'bg-secondary rounded-md' : ''}`}>
                        <Calculator className="text-white w-6" />
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/loans" className={`hover:bg-secondary hover:rounded-md p-3 flex justify-center ${routeLocation === '/loans' ? 'bg-secondary rounded-md' : ''}`}>
                        <BanknoteArrowUp className="text-white w-6" />
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/payments" className={`hover:bg-secondary hover:rounded-md p-3 flex justify-center ${routeLocation === '/payments' ? 'bg-secondary rounded-md' : ''}`}>
                        <HandCoins className="text-white w-6" />
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/customers" className={`hover:bg-secondary hover:rounded-md p-3 flex justify-center ${routeLocation === '/customers' ? 'bg-secondary rounded-md' : ''}`}>
                        <User className="text-white w-6" />
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/config" className={`hover:bg-secondary hover:rounded-md p-3 flex justify-center ${routeLocation === '/config' ? 'bg-secondary rounded-md' : ''}`}>
                        <Cog className="text-white w-6" />
                    </NavLink>
                </li>
            </ul>
        </nav>
    )
}

export default Nav