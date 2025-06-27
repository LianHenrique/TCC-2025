import { useState, useContext } from 'react';
import Form from 'react-bootstrap/Form';
import '../Style/login.css';
import { Button, Container, FloatingLabel } from 'react-bootstrap';
import NavBar from '../../components/NavBar/NavBar';
import { useNavigate } from 'react-router';
import { AuthContext } from '../../Contexts/UserContext';

import logo from "../../assets/logo.png";
import { ThemeContext } from '../../Contexts/ThemeContext';

const Cadastro = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confSenha, setConfSenha] = useState('');
  const [palavraChave, setPalavraChave] = useState('');
  // const [cnpj, setCnpj] = useState('');

  const validarEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // Pegando o tema atual (assumindo que ThemeContext retorna um objeto)
  const theme = useContext(ThemeContext);
  const darkMode = theme.darkMode; // ajuste conforme a estrutura do seu ThemeContext

  //validador de campos funciona
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nome || !email || !senha || !confSenha /* || !cargo */) { // removido cnpj e cargo comentado, ajuste conforme necessidade
      alert('Todos os campos são obrigatórios!');
      return false;
    }

    if (!validarEmail(email)) {
      alert('Email inválido!');
      return false;
    }

    if (senha.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres!');
      return false;
    }

    if (nome.length < 4) {
      alert('O nome deve ter pelo menos 4 caracteres!');
      return false;
    }

    if (senha !== confSenha) {
      alert('As senhas não coincidem!');
      return false;
    }

    try {
      const res = await fetch('http://localhost:3000/cliente/insert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, email, senha, palavra_chave: palavraChave }),
      });

      if (res.ok) {
        console.log('Cadastro realizado com sucesso!');

        // Fazer login automático após cadastro
        const loginRes = await fetch("http://localhost:3000/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, senha }),
        });

        const loginData = await loginRes.json();

        if (loginRes.ok && loginData.usuario) {
          login(loginData.usuario); // Atualiza o contexto
          alert("Cadastro realizado com sucesso!");
          navigate("/estoque");
        } else {
          alert("Cadastro feito, mas houve um problema ao fazer login automático.");
          navigate("/login");
        }
      } else {
        const erro = await res.json();
        alert(erro.error || 'Erro ao cadastrar. Palavra chave inválida.');
      }
    } catch (err) {
      console.error(err);
      alert('Erro de rede ou servidor.');
    }

    return true;
  };

  return (
    <div style={{ marginTop: '100px' }}>
      <NavBar />
      <Container style={{ maxWidth: '500px' }}>
        <Form
          onSubmit={handleSubmit}
          className="shadow"
          style={{ padding: '30px', textAlign: "center", borderRadius: '20px', border: '1px blue solid' }}
        >
          <img src={logo} width={100} alt="Logo" />
          <h1 style={{ textAlign: 'center' }}>Cadastro</h1>

          <FloatingLabel controlId="nome" label="Nome" className="m-2">
            <Form.Control
              type="text"
              placeholder="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="rounded-3 shadow mt-3"
              style={{ border: 'none' }}
            />
          </FloatingLabel>

          <FloatingLabel controlId="email" label="Email" className="m-2">
            <Form.Control
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-3 shadow mt-3"
              style={{ border: 'none' }}
            />
          </FloatingLabel>

          <FloatingLabel controlId="senha" label="Senha" className="m-2">
            <Form.Control
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="rounded-3 shadow mt-3"
              style={{ border: 'none' }}
            />
          </FloatingLabel>

          <FloatingLabel controlId="confSenha" label="Confirmação de senha" className="m-2">
            <Form.Control
              type="password"
              placeholder="Confirmação de senha"
              value={confSenha}
              onChange={(e) => setConfSenha(e.target.value)}
              className="rounded-3 shadow mt-3"
              style={{ border: 'none' }}
            />
          </FloatingLabel>

          <FloatingLabel controlId="palavraChave" label="Palavra-chave de recuperação" className="m-2">
            <Form.Control
              type="text"
              placeholder="Palavra-chave"
              value={palavraChave}
              onChange={(e) => setPalavraChave(e.target.value)}
              className="rounded-3 shadow mt-3"
              style={{ border: 'none' }}
            />
          </FloatingLabel>

          {/* Outros campos comentados */}

          <Button
            type="submit"
            className="shadow mt-4"
            style={{ padding: '15px', width: '90%', marginLeft: '20px' }}
          >
            Cadastrar
          </Button>

          <Button
            className="shadow mt-4"
            variant="outline-primary"
            href="/"
            style={{ padding: '15px', width: '90%', marginLeft: '20px' }}
          >
            Voltar
          </Button>

          <Button
            href="/login"
            variant="link"
            className="m-3"
            style={{
              color: darkMode ? 'white' : 'black',
              background: "none",
              border: "none",
              padding: 0,
            }}
          >
            Já tem uma conta? Log-in
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default Cadastro;
