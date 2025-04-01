import { createBrowserRouter } from "react-router-dom"
import HomeLogin from "./pages/Login/HomeLogin";
import Estoque from "./pages/Estoque/Estoque";
import Franquias from "./pages/Franquias/Franquias";
import Funcionario from "./pages/Funcionario/Funcionario";
import App from "./App";
import { ErrorPage } from "./pages/Error/ErrorPage";

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
                path: '/franquia', 
                element: <Franquias />
            },
            {
                path: '/funcionario', 
                element: <Funcionario />
            },
        ]
    }
]);

export default MyRouter