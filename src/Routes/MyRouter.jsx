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
import Visualizar_Cardapio from "../pages/Visualizacoes/Visualizar_Cardapio"
import RecSenha from "../pages/RecSenha/RecSenha"
import DataVencimento from "../pages/Alerta/DataVencimento.jsx"
import PrivateRoute from "../components/PrivateRoute/PrivateRoute.jsx"

const MyRouter = createBrowserRouter([
    {
        path: "/",
        element: <InitPages />,
        children: [
            {
                path: "/",
                element: (
                    <PrivateRoute allowedRoles={["ADM", "Gerente", "Funcionario"]}>
                        <Home />
                    </PrivateRoute>
                )
            },
            {
                path: "/home",
                element: (
                    <PrivateRoute allowedRoles={["ADM", "Gerente", "Funcionario"]}>
                        <Home />
                    </PrivateRoute>
                )
            },
            {
                path: "/estoque",
                element: (
                    <PrivateRoute allowedRoles={["ADM", "Gerente", "Funcionario"]}>
                        <Estoque />
                    </PrivateRoute>
                )
            },
            {
                path: "/funcionarios",
                element: (
                    <PrivateRoute allowedRoles={["ADM"]}>
                        <Funcionarios />
                    </PrivateRoute>
                )
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
                element: (
                    <PrivateRoute allowedRoles={["ADM", "Gerente"]}>
                        <Insumos />
                    </PrivateRoute>
                )
            },
            {
                path: "/cadastro_funcionario",
                element: (
                    <PrivateRoute allowedRoles={["ADM"]}>
                        <Funcionario />
                    </PrivateRoute>
                )
            },
            {
                path: "/cadastro_produto",
                element: (
                    <PrivateRoute allowedRoles={["ADM", "Funcionario", "Gerente"]}>
                        <Produto />
                    </PrivateRoute>
                )
            },
            {
                path: "/relatorio",
                element: (
                    <PrivateRoute allowedRoles={["ADM", "Gerente"]}>
                        <Relatorios />
                    </PrivateRoute>
                )
            },
            {
                path: "/cardapio",
                element: (
                    <PrivateRoute allowedRoles={["ADM", "Gerente", "Funcionario"]}>
                        <Cardapio />
                    </PrivateRoute>
                )
            },
            {
                path: "/visualizar/:id",
                element: (
                    <PrivateRoute allowedRoles={["ADM", "Gerente", "Funcionario"]}>
                        <Visualizar />
                    </PrivateRoute>
                )
            },
            {
                path: "/visualizar_funcionario/:id",
                element: (
                    <PrivateRoute allowedRoles={["ADM", "Gerente"]}>
                        <Relatorio_Funcionario />
                    </PrivateRoute>
                )
            },
            {
                path: "/agenda",
                element: <Agenda />
            },
            {
                path: "/alertas",
                element: (
                    <PrivateRoute allowedRoles={["ADM", "Gerente"]}>
                    <Alerta />
                    </PrivateRoute>
                )
            },
            {
                path: "/Visualizar_Cardapio/:id",
                element: <Visualizar_Cardapio />
            },
            {
                path: "/recuperar_senha",
                element: <RecSenha />
            },
            {
                path: "/data/vencimento",
                element: <DataVencimento />
            }
        ]
    }
])

export default MyRouter