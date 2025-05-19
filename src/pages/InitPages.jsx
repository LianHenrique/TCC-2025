import { Outlet } from "react-router"
import { AuthProvider } from '../Contexts/UserContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from "../Contexts/UserContext";

const InitPages = () => {
  return (
    <div>
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    </div>
  )
}

export default InitPages