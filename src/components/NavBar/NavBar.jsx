import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import { useContext } from "react";
import { AuthContext } from "../../Contexts/UserContext";
import { ThemeContext } from "../../Contexts/ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa";
import styles from "./NavBar.module.css";

import logo from "../../assets/logo.png";

const NavBar = () => {
  const { usuarioNome, logout } = useContext(AuthContext);
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  const tit = usuarioNome ? "/estoque" : "/home";

  return (
    <Navbar expand="lg" bg="primary" data-bs-theme="dark" fixed="top">
      <Container>
        <div className="d-flex align-items-center">
          <img src={logo} width={50} height={50} alt="logo" className="me-2" />
          <Navbar.Brand className={styles.Titulo} href={tit}>StoryBox</Navbar.Brand>
        </div>

        <Navbar.Toggle aria-controls="minha-nav" />
        <Navbar.Collapse id="minha-nav" className="justify-content-between">
          {!!usuarioNome?.trim() ? (
            <>
              <Nav className="ms-4">
                <Nav.Link href="/relatorio" className={styles.button}>Relatório</Nav.Link>
                <Nav.Link href="/estoque" className={styles.button}>Insumos</Nav.Link>
                <Nav.Link href="/funcionarios" className={styles.button}>Funcionários</Nav.Link>
                <Nav.Link href="/cardapio" className={styles.button}>Produtos</Nav.Link>
                <Nav.Link href="/alertas" className={styles.button}>Alertas</Nav.Link>
              </Nav>

              <div className="d-flex align-items-center gap-3"
                style={{
                  justifyContent: "center"
                }}>
                <Button
                  variant={darkMode ? "light" : "dark"}
                  onClick={toggleTheme}
                  title="Alternar tema"
                  style={{
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                  className="rounded-circle"
                >
                  {darkMode ? <FaSun size={22} /> : <FaMoon size={22} />}
                </Button>

                <Button
                  variant="danger"
                  style={{ width: "100px" }}
                  onClick={logout}
                  href="/login"
                >
                  Sair
                </Button>
              </div>
            </>
          ) : (
            <div className="d-flex align-items-center gap-3 w-100 justify-content-end">
              <Nav.Link href="/cadastro" className={styles.botaoCadastro} style={{ color: "white" }}>
                Cadastre-se
              </Nav.Link>
              <Button variant="light" href="/login" className="text-primary">Login</Button>
            </div>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
