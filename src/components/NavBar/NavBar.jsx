import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";

import { BsShop } from "react-icons/bs";

import { useContext } from "react"

import { AuthContext } from "../../Contexts/UserContext"

const NavBar = () => {

  const usuarioNome = "Visitante"

  return (
    <div>
        <Navbar expand="md" bg="primary" data-bs-theme="dark">
            <Container>
                <Navbar.Brand href="/home">
                    StoryBox
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="minha-nav" />
                <Navbar.Collapse id="minha-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/home"> Produtos </Nav.Link>
                        <Nav.Link href="/estoque"> Estoque </Nav.Link>
                    </Nav>
                    <Nav className="justify-content-end">
                        <Navbar.Text style={{color:"white", marginRight:"5px"}}>
                            {/* Caso usuario tenha feito login, aparece sair, se não aparece entrar */}
                        {
                            usuarioNome === "Visitante" ? (
                                <>
                                    <Button variant="primary" href="/login"
                                    style={{width:"100px"}}
                                    >
                                        Entrar
                                    </Button>
                                </>
                            ) : (
                                <>
                                    Usuario: {usuarioNome}
                                    <Button variant="danger" href="/login"
                                    style={{width:"100px", margin:"10px"}}
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