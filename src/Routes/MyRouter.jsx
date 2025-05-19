import { createBrowserRouter } from "react-router"
import InitPages from "../pages/InitPages"
import Home from "../pages/Home/Home"
import Estoque from "../pages/Estoque/Estoque"
import Login from "../pages/Login/Login"
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
                path: "/funcionarios",
                element: <Funcionarios />
            },
            {
                path: "/login",
                element: <Login />
            },
        ]
    }
])

export default MyRouter