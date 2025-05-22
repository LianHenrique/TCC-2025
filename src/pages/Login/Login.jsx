import { useState } from "react"
import Form from 'react-bootstrap/Form';
import NavBar from '../../components/NavBar/NavBar';
import '../Style/login.css'; // Importa o CSS
import { useNavigate } from "react-router";

const Login = () => {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const navigate = useNavigate(); 

    const verificacao  = (e) => {
        e.preventDefault();

        if(email === "" || senha === ""){
            setEmail("");
            setSenha("");
            alert("Preencha todos os campos");
            return;
        }

        const logins = JSON.parse(localStorage.getItem("logins")) || [];

        const usuarioEncontrado = logins.find((logins) => logins.email === email);

        if(!usuarioEncontrado) {
            setEmail("");
            setSenha("");
            alert("Email não cadastrado!")
            return;
        }

        if(usuarioEncontrado.senha !== senha) {
            setEmail("");
            setSenha("");
            alert("Informações inválidas!")
            return;
        }

        alert("Login aceito!")
        
        setEmail("")
        setSenha("")

    }

    return(
        
         <div className="login-bg">
            <div className="login-box">
        <Lay/>
        <h2>Login</h2>
            <Form>
                  <Form.Group className="mb-3" controlId="formGroupEmail">
                             <Form.Label>Email</Form.Label>
                             <Form.Control type="email" placeholder="Digite o email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formGroupPassword">
                            <Form.Label>Senha</Form.Label>
                            <Form.Control type="password" placeholder="Digite sua senha" value={senha} onChange={(e) => setSenha(e.target.value)} required />
                  </Form.Group>
                 
            </Form>
             
            <button variant="primary" style={{ width: '100%', backgroundColor: '#3840BA' }}>Entrar</button>

            {verificacao.ok && navigate('/')}
        </div>
        </div>
    )
}

export default Login