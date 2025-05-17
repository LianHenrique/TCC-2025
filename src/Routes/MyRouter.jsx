import { createBrowserRouter } from "react-router"
import InitPages from "../pages/InitPages"
import Home from "../pages/Home/Home"
import Estoque from "../pages/Estoque/Estoque"
import Relatorios from "../pages/Relatorios/Relatorios"
import Login from "../pages/Login/Login"
import Cardapio from "../pages/Cardapio/Cardapio"
import Funcionarios from "../pages/Funcionarios/Funcionarios"

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
                path: "/relatorios",
                element: <Relatorios />
            },
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/cardapio",
                element: <Cardapio />
            },
            {
                path: "/funcionarios",
                element: <Funcionarios />
            },
        ]
    }
])

export default MyRouter