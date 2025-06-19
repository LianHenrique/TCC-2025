import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import { useContext } from "react";
import { AuthContext } from "../../Contexts/UserContext";
import styles from "./NavBar.module.css"

import logo from "../../assets/logo.png"

const NavBar = () => {

  const { usuarioNome, logout } = useContext(AuthContext);

  let tit;

  if (usuarioNome == "") {
    tit = "/home"
  }
  else {
    tit = "/estoque"
  }

  return (

    <div >
      {/* Coloquei fixed-top na navbar */}
      <Navbar expand="lg" bg="primary" data-bs-theme="dark" fixed="top">
          <Navbar.Brand className={styles.Titulo} href={tit}>
            StoryBox
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="minha-nav" />
          <Navbar.Collapse
            id="minha-nav" className="justify-content-between">

            {!!usuarioNome?.trim() ? (
              <>
                <Nav>
                  <Nav.Link href="/relatorio" className={styles.button}>Relatório</Nav.Link>
                  <Nav.Link href="/estoque" className={styles.button}>Insumos</Nav.Link>
                  <Nav.Link href="/funcionarios" className={styles.button}>Funcionários</Nav.Link>
                  <Nav.Link href="/cardapio" className={styles.button}>Produtos</Nav.Link>
                  {/* <Nav.Link href="/agenda" className={styles.button}>Agenda</Nav.Link> */}
                  <Nav.Link href="/alertas" className={styles.button}>Alertas</Nav.Link>
                </Nav>
                <Button variant="danger"
                  style={{ marginTop: "20px", marginBottom: "20px", width: "100px" }} onClick={logout} href="/login">Sair</Button>
              </>
            ) : (
              <div className="d-flex align-items-center gap-3"
                style={{
                  justifyContent: "end",
                  width: "100%"
                }}>
                <Nav.Link href="/cadastro" className={styles.botaoCadastro} style={{
                  color: "white"
                }}>Cadastre-se</Nav.Link>
                <Button variant="light" href="/login" className="text-primary">Login</Button>
              </div>
            )}
          </Navbar.Collapse>
      </Navbar>
    </div >
  );
};

export default NavBar;