import { useContext } from "react";
import { AuthContext } from "../../Contexts/UserContext";
import { Navigate } from "react-router";

const PrivateRoute = ({children, allowedRoles}) => {
    const {cargoUsuario, isloading} = useContext(AuthContext);

    if(isloading){
        return <p>Carregando...</p>
    }

    // Retorna ao login se não estiver logado
    if(!cargoUsuario){
        return <Navigate to="/login" replace/>
    }
    // O replace na linha 10 impede que o navegador guarde o histórico da rota da página anterior, ou seja o usuário não consegue transitar entre as páginas quando for redirecionado.

    if(!allowedRoles.includes(cargoUsuario)){
        return <Navigate to="/" replace/>;
    }

    return children;
}

export default PrivateRoute