import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";

import { useContext } from "react";
import { AuthContext } from "../../Contexts/UserContext";

const NavBar = () => {

  const { usuarioNome, logout } = useContext(AuthContext);

  return (

    <div>
      <Navbar expand="lg" bg="primary" data-bs-theme="dark" className="d-flex justify-content-center shadow">
        <Container>
          <Navbar.Brand 
          className="fs-1"
          href="/home">
          StoryBox
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="minha-nav" />
          <Navbar.Collapse id="minha-nav">
            {
              usuarioNome != "Visitante" && 
              ( 
                <Nav className="me-auto">
                  <Nav.Link href="/relatorio"> Relatorio </Nav.Link>
                  <Nav.Link href="/estoque"> Estoque </Nav.Link>
                  <Nav.Link href="/funcionarios"> Funcionarios </Nav.Link>
                  <Nav.Link href="/agenda"> Agenda </Nav.Link>
                  <Nav.Link href="/cardapio"> Cardapio </Nav.Link>
                </Nav>
              )
            }
            <Nav className="justify-content-end">
              <Navbar.Text style={{ color: "white", marginRight: "5px" }}>
                {/* Caso usuario tenha feito login, aparece sair, se não aparece entrar */}
                {
                  usuarioNome === "Visitante" ? (
                    <div className="d-flex align-items-center gap-3">
                      <Nav.Link href="#"> Cadastre-se </Nav.Link>
                      <Button 
                        className="shadow"
                        variant="primary" 
                        href="/login"
                        style={{ width: "100px", margin: "10px 0" }}
                      >
                        Login
                      </Button>
                    </div>
                  ) : (
                    <>
                      Usuario: {usuarioNome}
                      <Button 
                        className="shadow"
                        variant="danger" 
                        href="/login"
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