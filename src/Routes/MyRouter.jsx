import { createBrowserRouter } from "react-router"
import InitPages from "../pages/InitPages"
import Home from "../pages/Home/Home"
import Estoque from "../pages/Estoque/Estoque"
import Login from "../pages/Login/Login"
import Funcionarios from "../pages/Funcionarios/Funcionarios"
import Cadastro from "../pages/Cadastro/Cadastro"
import Relatorios from "../pages/Relatorios/Relatorios"
import Cardapio from "../pages/Cardapio/Cardapio"
import Cadastroprod from "../pages/Cadastro/Cadastro_prod"

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
                path: "/cadastro_produto",
                element: <Cadastroprod />
            },
            {
                path: "/relatorio",
                element: <Relatorios/>
            },
            {
                path: "/cardapio",
                element: <Cardapio />
            },
        ]
    }
])

export default MyRouter