import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import '../Style/login.css'; // Importa o CSS
import { Button, Container, FloatingLabel } from 'react-bootstrap';
import NavBar from '../../components/NavBar/NavBar';

const Cadastro = () => {

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
        </Form>
      </Container>
    </div>
  )
}

export default Cadastro