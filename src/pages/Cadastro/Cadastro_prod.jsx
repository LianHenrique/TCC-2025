import { useState } from 'react';
import '../Style/login.css'; // Importa o CSS
import NavBar from '../../components/NavBar/NavBar';
import { Button, Container, FloatingLabel, Form } from 'react-bootstrap';

const Cadastroprod = () => {
    const [senha, setSenha] = useState("");
    const [nome, setNomeprod] = useState("");

    const Cadastrosprod = () => {
        const users = JSON.parse(localStorage.getItem("users")) || [];

        if (senha === "" || nome === "") {
            alert("Os campos não podem ser vazios")
            setNomeprod("");
            setSenha("");
            return;
        } // mantem mudando as validações
        if (senha.length >= 0) {
            alert("A Quantidade/preço deve ter no mínimo 1 numero")
            setNomeprod("");
            setSenha("");
            return;
        }

        const novoUsuario = {
            nome: nome,
            senha: senha,
        };

        users.push(novoUsuario);

        localStorage.setItem("users", JSON.stringify(users));

        alert("Cadastro realizado com sucesso!");
        setNomeprod("");
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
        </Form>
      </Container>
    </div>

    )
}

export default Cadastroprod