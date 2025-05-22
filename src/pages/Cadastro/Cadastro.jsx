import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import '../Style/login.css'; // Importa o CSS
import { Button, Container, FloatingLabel } from 'react-bootstrap';
import NavBar from '../../components/NavBar/NavBar';

const Cadastro = () => {
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfir] = useState("");
  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");

  const validarEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  const Cadastros = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const usuarioExistente = users.find((user) => user.email === email);

    if (senha === "" || confirmarSenha === "" || email === "" || nome === "") {
      alert("Os campos não podem ser vazios")
      setConfir("");
      setEmail("");
      setNome("");
      setSenha("");
      return;
    }
    if (senha.length < 8) {
      alert("A senha deve ter no mínimo 8 caracteres")
      setConfir("");
      setEmail("");
      setNome("");
      setSenha("");
      return;
    }
    if (senha != confirmarSenha) {
      alert("As senhas não são iguais")
      setConfir("");
      setEmail("");
      setNome("");
      setSenha("");
      return;
    }

    if (usuarioExistente) {
      alert("Este email já está cadastrado!");
      setConfir("");
      setEmail("");
      setNome("");
      setSenha("");
      return;
    }

    if (!validarEmail(email)) {
      alert("Formato de email inválido!");
      setConfir("");
      setEmail("");
      setNome("");
      setSenha("");
      return;
    }

    const novoUsuario = {
      nome: nome,
      email: email,
      senha: senha,
    };

    users.push(novoUsuario);

    localStorage.setItem("users", JSON.stringify(users));

    alert("Cadastro realizado com sucesso!");

    setConfir("");
    setEmail("");
    setNome("");
    setSenha("");
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
            padding: "10px",
            margin: "100px",
            borderRadius: "20px",
          }}>
          <h1 style={{
            textAlign: "center"
          }}>
            Cadastro
          </h1>
          <FloatingLabel
            controlId="floatingInput"
            label="Nome"
            className="m-2">
            <Form.Control
              type="text"
              placeholder="Nome"
              className="rounded-5 shadow mt-3"
              style={{
                border: "none"
              }}
            />
          </FloatingLabel>

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
              type="Senha"
              placeholder="Nome"
              className="rounded-5 shadow mt-3"
              style={{
                border: "none"
              }}
            />
          </FloatingLabel>

          <FloatingLabel
            controlId="floatingInput"
            label="Confirmação de senha"
            className="m-2">
            <Form.Control
              type="text"
              placeholder="Confirmação de senha"
              className="rounded-5 shadow mt-3"
              style={{
                border: "none"
              }}
            />
          </FloatingLabel>

          <FloatingLabel
            controlId="floatingInput"
            label="CNPJ"
            className="m-2">
            <Form.Control
              type="number"
              placeholder="CNPJ"
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
            Cadastrar
          </Button>
          <Button
            className="shadow mt-4"
            style={{
              padding: "15px",
              width: "90%",
              borderRadius: "30px",
              marginLeft: "20px"
            }}>
            Voltar
          </Button>
        </Form>
      </Container>
    </div>
  )
}

export default Cadastro