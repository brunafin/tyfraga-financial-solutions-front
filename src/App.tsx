import { Route, Routes } from "react-router"
import Header from "./components/Header"
import Nav from "./components/Nav"
import Dashboard from "./pages/Dashboard"
import Customers from "./pages/Customers"
import CreateCustomer from "./pages/Customers/CreateCustomer"
import Details from "./pages/Customers/Details"
import NotDevelopment from "./pages/NotDevelopment"

function App() {

  return (
    <>
      <Header />
      <div className="h-[79vh] overflow-y-auto">
      <Routes>
        <Route index path="/" element={<Dashboard />} />
        <Route path="/customers">
          <Route index element={<Customers />} />
          <Route path="create" element={<CreateCustomer />} />
          <Route path=":id" element={<Details />} />
        </Route>
        <Route path="simulator" element={<NotDevelopment />}/>
        <Route path="loans" element={<NotDevelopment />}/>
      </Routes>
      </div>
      <Nav />
    </>
  )
}

export default App
