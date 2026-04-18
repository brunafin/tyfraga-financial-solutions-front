import LogoFull from "../../assets/logo-full.svg"
import { NavLink } from "react-router"

const Header = () => {
    return (
        <header className="bg-white flex justify-center items-center h-[10vh] p-3">
            <NavLink to="/" className='flex items-center gap-2'>
                <img src={LogoFull} title="Logo Turcoin" alt="Logo Turcoin"/>
            </NavLink>
        </header>
    )
}

export default Header