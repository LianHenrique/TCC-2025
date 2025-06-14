
import { useState } from "react"
import Form from 'react-bootstrap/Form';
import NavBar from '../../components/NavBar/NavBar';
import { useNavigate } from "react-router";
import { Button, Container, FloatingLabel } from "react-bootstrap";

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  const verificacao = (e) => {
    e.preventDefault();

    if (email === "" || senha === "") {
      setEmail("");
      setSenha("");
      alert("Preencha todos os campos");
      return;
    }

    const logins = JSON.parse(localStorage.getItem("logins")) || [];

    const usuarioEncontrado = logins.find((logins) => logins.email === email);

    if (!usuarioEncontrado) {
      setEmail("");
      setSenha("");
      alert("Email não cadastrado!")
      return;
    }

    if (usuarioEncontrado.senha !== senha) {
      setEmail("");
      setSenha("");
      alert("Informações inválidas!")
      return;
    }

    alert("Login aceito!")

    setEmail("")
    setSenha("")

  }

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
            controlId="floatingInput"
            label="Email"
            className="m-2">
            <Form.Control
              type="text"
              placeholder="Email"
              className="rounded-5 shadow mt-3"
              style={{
                border: "none"
              }}
            />
          </FloatingLabel>

          <FloatingLabel
            controlId="floatingInput"
            label="Senha"
            className="m-2">
            <Form.Control
              type="text"
              placeholder="Senha"
              className="rounded-5 shadow mt-3"
              style={{
                border: "none"
              }}
            />
          </FloatingLabel>

          <Button
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
