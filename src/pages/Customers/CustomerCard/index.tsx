import { NavLink } from "react-router";

interface ICustomerCardProps {
    uuid: string;
    name: string;
    loansCount: number;
}

const CustomerCard = ({uuid, name, loansCount}: ICustomerCardProps) => {
    return(
        <li className="shadow rounded-sm px-4 py-3 bg-gray-50 text-gray-800">
            <NavLink to={`/customers/${uuid}`}>
                <div>
                    <h3 className="font-bold">{name}</h3>
                    <p className="text-sm">{loansCount} empréstimo(s)</p>
                </div>
            </NavLink>
        </li>
    )
}
export default CustomerCard