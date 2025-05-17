import { Outlet } from "react-router"
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from "../contexts/UserContext";

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