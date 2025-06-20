import { Outlet } from "react-router-dom";
import { AuthProvider } from '../Contexts/UserContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import Notficacao from "../Notificacao/Notficacao";
import { ThemeProvider } from "../Contexts/ThemeContext";
import AlertaCritico from "./Alerta/AlertaCritico.jsx";

const InitPages = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Notficacao />
        <AlertaCritico />
        <Outlet />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default InitPages;
