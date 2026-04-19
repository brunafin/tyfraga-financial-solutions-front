import { Route, Routes } from "react-router"
import Header from "./components/Header"
import Nav from "./components/Nav"
import Dashboard from "./pages/Dashboard"
import Customers from "./pages/Customers"
import CreateCustomer from "./pages/Customers/CreateCustomer"
import Details from "./pages/Customers/Details"
import NotDevelopment from "./pages/NotDevelopment"
import Simulator from "./pages/Simulator"
import { LoaderProvider } from "./contexts/Loader/LoaderProvider"
import UiComponents from "./pages/Config/UiComponents"
import Config from "./pages/Config"

function App() {

  return (
    <LoaderProvider>
      <div className="max-h-dvh overflow-y-auto">
        <Header />
        <div>
        <Nav />
        <div>
          <Routes>
            {/* <Route index path="/" element={<Dashboard />} /> */}
            <Route index path="/" element={<Simulator />} />
            <Route path="/customers">
              <Route index element={<Customers />} />
              <Route path="create" element={<CreateCustomer />} />
              <Route path=":id" element={<Details />} />
            </Route>
            <Route path="simulator" element={<Simulator />} />
            <Route path="loans" element={<NotDevelopment />} />
            <Route path="payments" element={<NotDevelopment />} />
            <Route path="config" element={<Config />} />
            <Route path="config/ui" element={<UiComponents />} />
          </Routes>
        </div>
        </div>
      </div>
    </LoaderProvider>
  )
}

export default App
