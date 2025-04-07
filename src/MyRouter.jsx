import { createBrowserRouter } from "react-router-dom"
import HomeLogin from "./pages/Login/HomeLogin";
import Estoque from "./pages/Estoque/Estoque";
import Funcionario from "./pages/Funcionario/Funcionario";
import App from "./App";
import { ErrorPage } from "./pages/Error/ErrorPage";
import Relatorio from "./pages/Relatorio/Relatorio";

const MyRouter = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '/', 
                element: <HomeLogin />
            },
            {
                path: '/login', 
                element: <HomeLogin />
            },
            {
                path: '/estoque', 
                element: <Estoque />
            },
            {
                path: '/funcionario', 
                element: <Funcionario />
            },
            {
                path: '/relatorio',
                element: <Relatorio />
            },
        ]
    }
]);

export default MyRouter