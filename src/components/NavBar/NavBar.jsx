import { useNavigate } from "react-router";
import styles from "../Components.module.css";
import { Container, Nav, Navbar } from "react-bootstrap";

const NavBar = () => {
<<<<<<< HEAD
  const navItems = ["Para quem", "Soluções", "Preços"];

  return (
    <nav className={styles.NavBar}>
      <h1 translate="no" className={styles.FullH1}>StoryBox</h1>

      <div className={styles.MinBaseButtons}>
        <h1 translate="no">StoryBox</h1>
        <div>
          <Button translate="no" className={styles.Button}>
            Cadastro
          </Button>
          <Button translate="no" className={styles.Button}>
            Login
          </Button>
        </div>
      </div>

      <div className={styles.DivButton}>
        <ButtonGroup>
          {navItems.map((item, index) => (
            <Button key={index} className={styles.Button}>
              {item}
            </Button>
          ))}
        </ButtonGroup>
      </div>

      <div className={styles.FullBaseButtons}>
        <Button translate="no" className={styles.Button}>
          Cadastro
        </Button>
        <Button translate="no" className={styles.Button}>
          Login
        </Button>
      </div>
    </nav>
=======

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
>>>>>>> 87b31c450c5db35bce4aa98907b4361ce85cdfe5
  );
};

export default NavBar;