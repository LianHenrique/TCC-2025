import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";

import { useContext } from "react"

import { AuthContext } from "../../contexts/UserContext"

const NavBar = () => {

  const { usuarioNome, logout } = useContext(AuthContext);

  return (
    <div>
      <Navbar expand="lg" bg="primary" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="/home">
            StoryBox
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="minha-nav" />
          <Navbar.Collapse id="minha-nav">
            <Nav className="me-auto">
              <Nav.Link
                href="/relatorios">
                Relatorio
              </Nav.Link>
              <Nav.Link
                href="/estoque">
                Estoque
              </Nav.Link>
              <Nav.Link
                href="/funcionarios">
                Funcionarios
              </Nav.Link>
              <Nav.Link
                href="#agenda">
                Agenda
              </Nav.Link>
              <Nav.Link
                href="/cardapio">
                Cardapio
              </Nav.Link>
            </Nav>
            <Nav className="justify-content-end">
              <Navbar.Text style={{ color: "white", marginRight: "5px" }}>
                {
                  usuarioNome === "Visitante" ? (
                    <>
                      <Button
                        variant="primary"
                        href="/login"
                        style={{ width: "100px" }}
                        className="shadow"
                      >
                        Entrar
                      </Button>
                    </>
                  ) : (
                    <>
                      Usuario: {usuarioNome}
                      <Button variant="danger" href="/login"
                        style={{ width: "100px", margin: "10px" }}
                        onClick={logout}>
                        Sair
                      </Button>
                    </>
                  )
                }
              </Navbar.Text>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavBar;