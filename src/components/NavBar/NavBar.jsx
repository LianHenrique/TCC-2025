import { useNavigate } from "react-router";
import styles from "../Components.module.css";
import { Container, Nav, Navbar } from "react-bootstrap";

const NavBar = () => {

  return (
    <Navbar style={{ minHeight: "90px" }} bg="primary" data-bs-theme="dark">
      <Navbar.Brand href="#" className="fs-1 p-3">StoryBox</Navbar.Brand>
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