import LogoFull from "../../assets/logo-full.png"
import { NavLink } from "react-router"

const Header = () => {
    return (
        <header className="bg-white flex justify-center items-center h-[10vh] p-3">
            <NavLink to="/" className="flex items-center gap-2">
                <img
                    src={LogoFull}
                    title="Logo Turtcoin"
                    alt="Logo Turtcoin"
                    className="h-14 w-auto"
                />
            </NavLink>
        </header>
    )
}

export default Header
