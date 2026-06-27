import { Outlet, Route, Routes } from "react-router"
import Header from "./components/Header"
import Nav from "./components/Nav"
import ProtectedRoute from "./components/ProtectedRoute"
import Customers from "./pages/Customers"
import CreateCustomer from "./pages/Customers/CreateCustomer"
import Details from "./pages/Customers/Details"
import NotDevelopment from "./pages/NotDevelopment"
import Simulator from "./pages/Simulator"
import { LoaderProvider } from "./contexts/Loader/LoaderProvider"
import { ModalProvider } from "./contexts/Modal/ModalProvider"
import { AuthProvider } from "./contexts/Auth/AuthProvider"
import UiComponents from "./pages/Config/UiComponents"
import Config from "./pages/Config"
import LoanDetails from "./pages/Loan"
import Dashboard from "./pages/Dashboard"
import Timeline from "./pages/Timeline"
import Login from "./pages/Login"

function AppLayout() {
  return (
    <div className="max-h-dvh overflow-y-auto">
      <Header />
      <div>
        <Nav />
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <ModalProvider>
        <LoaderProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route index path="/" element={<Dashboard />} />
              <Route path="/customers">
                <Route index element={<Customers />} />
                <Route path="create" element={<CreateCustomer />} />
                <Route path=":id" element={<Details />} />
              </Route>
              <Route path="simulator" element={<Simulator />} />
              <Route path="loans/:id" element={<LoanDetails />} />
              <Route path="payments" element={<NotDevelopment />} />
              <Route path="config" element={<Config />} />
              <Route path="config/ui" element={<UiComponents />} />
              <Route path="timeline" element={<Timeline />} />
            </Route>
          </Route>
        </Routes>
        </LoaderProvider>
      </ModalProvider>
    </AuthProvider>
  )
}

export default App
