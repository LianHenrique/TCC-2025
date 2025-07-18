import { Outlet } from "react-router-dom";
import { AuthProvider } from '../Contexts/UserContext';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { ThemeProvider } from "../Contexts/ThemeContext";
import AlertaCritico from "./Alerta/AlertaCritico.jsx";

const InitPages = () => {
  return (
    <ThemeProvider>
      <AuthProvider> 
        {/* O AlertaCritico agora só será exibido para ADM e Gerente */}
        <AlertaCritico />
        <Outlet />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default InitPages;