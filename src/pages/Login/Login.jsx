
import { useContext, useState } from "react"
import Form from 'react-bootstrap/Form';
import NavBar from '../../components/NavBar/NavBar';
import { useNavigate } from "react-router";
import { Button, Container, FloatingLabel } from "react-bootstrap";
import { AuthContext } from "../../Contexts/UserContext";

import logo from "../../assets/logo.png"
import { ThemeContext } from "../../Contexts/ThemeContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // const funcionarioFuncio = "select nome_funcionario, cargo_funcionario from Funcionario where cargo_funcionario = 'gerente'"



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

  const theme = useContext(ThemeContext);
  const darkMode = theme.darkMode;

  return (

    <div
      style={{
        marginTop: "200px"
      }}>
      <NavBar />
      <Container
        style={{
          maxWidth: "500px"
        }}>
        <Form
          className='shadow rounded-4'
          style={{
            padding: "30px",
            border: "1px blue solid", textAlign: "center"
          }}>
          <img
            src={logo} width={100} alt="" />
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
              className="rounded-3 shadow mt-3"
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
              className="rounded-3 shadow mt-3"
              style={{ border: "none" }}
            />
          </FloatingLabel>

          <Button
            onClick={verificacao}
            className="shadow mt-4"
            style={{
              padding: "15px",
              width: "90%",
            }}>
            Entrar
          </Button>
          <div className="d-flex"
            style={{
              alignContent: "center"
            }}>
            <p
              style={{
                marginLeft: "20px",
                marginBottom: "0"
              }}>Esqueceu a senha? <a
                href="/recuperar_senha"
                style={{
                  color: darkMode ? 'white' : 'black',
                  background: "none",
                  border: "none",
                  padding: 0,
                }}>
                recuperar senha
              </a></p>
          </div>
          <Button
            className="shadow mt-4"
            variant='outline-primary'
            href="/home"
            style={{
              padding: "15px",
              width: "90%",
            }}>
            Voltar
          </Button>

          <div className="d-flex"
            style={{
              alignContent: "center"
            }}>
            <p
              style={{
                marginLeft: "20px"
              }}>Ainda não cadastrou? <a
                href="/cadastro"
                style={{
                  color: darkMode ? 'white' : 'black',
                  background: "none",
                  border: "none",
                  padding: 0,
                }}>
                cadastre-se
              </a></p>
        </div>
      </Form>
    </Container>
    </div >

  )
}

export default Login
