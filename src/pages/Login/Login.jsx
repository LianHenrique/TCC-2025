
import { useContext, useState } from "react"
import Form from 'react-bootstrap/Form';
import NavBar from '../../components/NavBar/NavBar';
import { useNavigate } from "react-router";
import { Button, Container, FloatingLabel } from "react-bootstrap";
import { AuthContext } from "../../Contexts/UserContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const verificacao = async (e) => {
    e.preventDefault();

    if (!email || !senha) {
      alert("Preencha todos os campos");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, senha })
      });

      const data = await response.json();

      if (response.ok) {
        login(data.usuario); // <-- Chamada do contexto
        alert("Login aceito!");
        navigate("/estoque");
        setEmail("");
        setSenha("");
      } else {
        alert(data.error || "Erro no login");
        setEmail("");
        setSenha("");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      alert("Erro ao conectar ao servidor.");
    }
  };

  return (

    <div
      style={{
        marginTop: "150px"
      }}>
      <NavBar />
      <Container
        style={{
          width: "650px"
        }}>
        <Form
          className='shadow'
          style={{
            padding: "30px",
            margin: "100px",
            borderRadius: "20px",
            border: "1px blue solid"
          }}>
          <h1 style={{
            textAlign: "center"
          }}>
            Login
          </h1>
          <FloatingLabel
            controlId="floatingInputEmail"
            label="Email"
            className="m-2">
            <Form.Control
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-5 shadow mt-3"
              style={{ border: "none" }}
            />
          </FloatingLabel>

          <FloatingLabel
            controlId="floatingInputSenha"
            label="Senha"
            className="m-2">
            <Form.Control
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="rounded-5 shadow mt-3"
              style={{ border: "none" }}
            />
          </FloatingLabel>

          <Button
            onClick={verificacao}
            className="shadow mt-4"
            style={{
              padding: "15px",
              width: "90%",
              borderRadius: "30px",
              marginLeft: "20px"
            }}>
            Entrar
          </Button>
          <Button
            href="/recuperar_senha"
            style={{
              background: "none",
              color: "black",
              border: "none",
              marginLeft: "20px"
            }}>
            Esqueceu a senha? recuperar senha
          </Button>
          <Button
            className="shadow mt-4"
            variant='outline-primary'
            href="/home"
            style={{
              padding: "15px",
              width: "90%",
              borderRadius: "30px",
              marginLeft: "20px"
            }}>
            Voltar
          </Button>
          <Button
            href="/cadastro"
            style={{
              background: "none",
              color: "black",
              border: "none",
              marginLeft: "20px"
            }}>
            Ainda não cadastrou? cadastre-se
          </Button>
        </Form>
      </Container>
    </div>

  )
}

export default Login
