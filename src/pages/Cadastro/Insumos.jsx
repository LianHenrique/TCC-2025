import '../Style/login.css'; // Importa o CSS
import NavBar from '../../components/NavBar/NavBar';
import { Button, Container, Dropdown, FloatingLabel, Form } from 'react-bootstrap';

const Insumos = () => {

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
            label="Valor unidade"
            className="m-2">
            <Form.Control
              type="text"
              placeholder="Valor unidade"
              className="rounded-5 shadow mt-3"
              style={{
                border: "none"
              }}
            />
          </FloatingLabel>

          <FloatingLabel
            controlId="floatingInput"
            label="Data de validade"
            className="m-2">
            <Form.Control
              type="Senha"
              placeholder="Data de validade"
              className="rounded-5 shadow mt-3"
              style={{
                border: "none"
              }}
            />
          </FloatingLabel>

          <FloatingLabel
            controlId="floatingInput"
            label="Quantidade"
            className="m-2">
            <Form.Control
              type="Senha"
              placeholder="Quantidade"
              className="rounded-5 shadow mt-3"
              style={{
                border: "none"
              }}
            />
          </FloatingLabel>

          <div
            className="d-flex m-2"
            style={{
              alignContent: "center"
            }}>
            <Dropdown
              className="d-flex shadow rounded-5 mt-2"
              style={{
                width: "150px",
                height: "60px"
              }}>
              <Dropdown.Toggle
                variant="outline-primary rounded-5"
                style={{
                  width: "150px",
                  height: "60px"
                }}>
                Filtro
              </Dropdown.Toggle>
              <Dropdown.Menu
                className='rounded-3'>
                <Dropdown.Item
                  to=""
                  className="dropdown-item rounded-5"
                >
                  Carnes
                </Dropdown.Item>
                <Dropdown.Item
                  to=""
                  className="dropdown-item rounded-5"
                >
                  Bebidas
                </Dropdown.Item>
                <Dropdown.Item
                  to=""
                  className="dropdown-item rounded-5"
                >
                  Saladas
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Button
              className="rounded-5 m-2 mt-2 fs-2"
              style={{
                width: "60px",
                height: "60px"
              }}>
              +
            </Button>
          </div>

          <Button
            className="shadow mt-4"
            href="/estoque"
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
            href="/estoque"
            style={{
              padding: "15px",
              width: "90%",
              borderRadius: "30px",
              marginLeft: "20px"
            }}>
            Cancelar
          </Button>
        </Form>
      </Container>
    </div>

  )
}

export default Insumos