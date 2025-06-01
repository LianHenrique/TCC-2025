import { Outlet } from "react-router"
import { AuthProvider } from '../Contexts/UserContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import Notficacao from "../Notificacao/Notficacao";

const InitPages = () => {
  return (
    <div>
      <AuthProvider>
        <Notficacao/>
        <Outlet />
      </AuthProvider>
    </div>
  )
}

export default InitPages