import { useNavigate } from "react-router";
import styles from "../Components.module.css";
import { Container, Nav, Navbar } from "react-bootstrap";

const NavBar = () => {

  const navigate = useNavigate()

  return (
    <Navbar bg="primary" data-bs-theme="dark">
          <h1>StoryBox</h1>
          <Nav className="me-auto">
            <Nav.Link href="#relatorio">Relatorio</Nav.Link>
            <Nav.Link href="/estoque">Estoque</Nav.Link>
            <Nav.Link href="#funcionario">Funcionarios</Nav.Link>
            <Nav.Link href="#cardapio">Cardapio</Nav.Link>
          </Nav>
      </Navbar>
  );
};

export default NavBar;

