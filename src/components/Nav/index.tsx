import { Calculator, ChartLine, LogOut, User } from "lucide-react"
import { NavLink, useLocation, useNavigate } from "react-router"
import { useAuth } from "../../contexts/Auth/useAuth"

const Nav = () => {
    const routeLocation = useLocation().pathname;
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="fixed bottom-0 left-0 z-40 h-20 w-full bg-primary p-3 md:h-full md:w-20">
            <ul className="flex md:flex-col gap-6 justify-around md:justify-start md:h-full">
                <li>
                    <NavLink to="/" className={`hover:bg-secondary hover:rounded-md p-3 flex justify-center ${routeLocation === '/' ? 'bg-secondary rounded-md' : ''}`}>
                        <ChartLine className="text-white w-6" />
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/simulator" className={`hover:bg-secondary hover:rounded-md p-3 flex justify-center ${routeLocation === '/simulator' ? 'bg-secondary rounded-md' : ''}`}>
                        <Calculator className="text-white w-6" />
                    </NavLink>
                </li>
                {/* <li>
                    <NavLink to="/payments" className={`hover:bg-secondary hover:rounded-md p-3 flex justify-center ${routeLocation === '/payments' ? 'bg-secondary rounded-md' : ''}`}>
                    <HandCoins className="text-white w-6" />
                    </NavLink>
                    </li> */}
                <li>
                    <NavLink to="/customers" className={`hover:bg-secondary hover:rounded-md p-3 flex justify-center ${routeLocation === '/customers' ? 'bg-secondary rounded-md' : ''}`}>
                        <User className="text-white w-6" />
                    </NavLink>
                </li>
                {/* <li>
                    <NavLink to="/loans" className={`hover:bg-secondary hover:rounded-md p-3 flex justify-center ${routeLocation === '/loans' ? 'bg-secondary rounded-md' : ''}`}>
                        <BanknoteArrowUp className="text-white w-6" />
                    </NavLink>
                </li> */}
                {/* <li>
                    <NavLink to="/config" className={`hover:bg-secondary hover:rounded-md p-3 flex justify-center ${routeLocation === '/config' ? 'bg-secondary rounded-md' : ''}`}>
                        <Cog className="text-white w-6" />
                    </NavLink>
                </li> */}
                <li className="md:mt-auto">
                    <button
                        type="button"
                        onClick={handleLogout}
                        title="Sair"
                        className="hover:bg-secondary hover:rounded-md p-3 flex justify-center w-full"
                    >
                        <LogOut className="text-white w-6" />
                    </button>
                </li>
            </ul>
        </nav>
    )
}

export default Nav