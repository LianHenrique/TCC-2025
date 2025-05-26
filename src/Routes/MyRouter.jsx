import { createBrowserRouter } from "react-router"
import InitPages from "../pages/InitPages"
import Home from "../pages/Home/Home"
import Estoque from "../pages/Estoque/Estoque"
import Login from "../pages/Login/Login"
import Funcionarios from "../pages/Funcionarios/Funcionarios"
import Cadastro from "../pages/Cadastro/Cadastro"
import Relatorios from "../pages/Relatorios/Relatorios"
import Cardapio from "../pages/Cardapio/Cardapio"
import Visualizar from "../pages/Visualizacoes/visualizar"

const MyRouter = createBrowserRouter([
    {
        path: "/",
        element: <InitPages />,
        children: [
            {
                path: "/",
                element: <Home />
            },
            {
                path: "/home",
                element: <Home />
            },
            {
                path: "/estoque",
                element: <Estoque />
            },
            {
                path: "/funcionarios",
                element: <Funcionarios />
            },
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/cadastro",
                element: <Cadastro />
            },
            {
                path: "/relatorios",
                element: <Relatorios/>
            },
            {
                path: "/cardapio",
                element: <Cardapio />
            },
            {
                path: "/visualizar/:id",
                element: <Visualizar/>
            }
        ]
    }
])

export default MyRouter