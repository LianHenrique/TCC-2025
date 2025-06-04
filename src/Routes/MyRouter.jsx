import { createBrowserRouter } from "react-router-dom"
import InitPages from "../pages/InitPages"
import Home from "../pages/Home/Home"
import Estoque from "../pages/Estoque/Estoque"
import Login from "../pages/Login/Login"
import Funcionarios from "../pages/Funcionarios/Funcionarios"
import Cadastro from "../pages/Cadastro/Cadastro"
import Relatorios from "../pages/Relatorios/Relatorios"
import Cardapio from "../pages/Cardapio/Cardapio"
import Visualizar from "../pages/Visualizacoes/visualizar"
import Insumos from "../pages/Cadastro/Insumos"
import Relatorio_Funcionario from "../pages/Visualizacoes/Relatorio_Funcionario"
import Funcionario from "../pages/Cadastro/Funcionario"
import Produto from "../pages/Cadastro/Produto"
import Agenda from "../pages/Agenda/Agenda"
import Alerta from "../pages/Alerta/Alerta"

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
                path: "/cadastro_insumos",
                element: <Insumos />
            },
            {
                path: "/cadastro_funcionario",
                element: <Funcionario />
            },
            {
                path: "/cadastro_produto",
                element: <Produto />
            },
            {
                path: "/relatorio",
                element: <Relatorios />
            },
            {
                path: "/cardapio",
                element: <Cardapio />
            },
            {
                path: "/visualizar/:id",
                element: <Visualizar />
            },
            {
                path: "/visualizar_funcionario/:id",
                element: <Relatorio_Funcionario />
            },
            {
                path: "/agenda",
                element: <Agenda />
            },
            {
                path: "/alertas",
                element: <Alerta/>
            }
        ]
    }
])

export default MyRouter