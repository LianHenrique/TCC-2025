import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import '../Style/login.css';
import { Button, Container, FloatingLabel } from 'react-bootstrap';
import NavBar from '../../components/NavBar/NavBar';
import { useNavigate } from 'react-router';

const Cadastro = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confSenha, setConfSenha] = useState('');
  const [cnpj, setCnpj] = useState('');

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (senha !== confSenha) {
      alert('As senhas não coincidem!');
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/cliente/insert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome,
          email,
          senha,
          cnpj,
        }),
      });

      if (res.ok) {
        console.log('Cadastro realizado com sucesso!');
        // Redirecionar, limpar ou atualizar UI
      } else {
        console.log('Erro ao cadastrar');
      }
    } catch (err) {
      console.error(err);
      console.log('Erro de rede ou servidor');
    }
  };

  return (
    <div style={{ marginTop: '150px' }}>
      <NavBar />
      <Container style={{ width: '650px' }}>
        <Form onSubmit={handleSubmit} className="shadow" style={{ padding: '30px', margin: '100px', borderRadius: '20px', border: '1px blue solid' }}>
          <h1 style={{ textAlign: 'center' }}>Cadastro</h1>

          <FloatingLabel controlId="nome" label="Nome" className="m-2">
            <Form.Control
              type="text"
              placeholder="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="rounded-5 shadow mt-3"
              style={{ border: 'none' }}
            />
          </FloatingLabel>

          <FloatingLabel controlId="email" label="Email" className="m-2">
            <Form.Control
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-5 shadow mt-3"
              style={{ border: 'none' }}
            />
          </FloatingLabel>

          <FloatingLabel controlId="senha" label="Senha" className="m-2">
            <Form.Control
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="rounded-5 shadow mt-3"
              style={{ border: 'none' }}
            />
          </FloatingLabel>

          <FloatingLabel controlId="confSenha" label="Confirmação de senha" className="m-2">
            <Form.Control
              type="password"
              placeholder="Confirmação de senha"
              value={confSenha}
              onChange={(e) => setConfSenha(e.target.value)}
              className="rounded-5 shadow mt-3"
              style={{ border: 'none' }}
            />
          </FloatingLabel>

          <FloatingLabel controlId="cnpj" label="CNPJ" className="m-2">
            <Form.Control
              type="number"
              placeholder="CNPJ"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              className="rounded-5 shadow mt-3"
              style={{ border: 'none' }}
            />
          </FloatingLabel>

          <Button
            type="submit"
            onClick={() => {
              navigate("/estoque")
            }}
            className="shadow mt-4"
            style={{ padding: '15px', width: '90%', borderRadius: '30px', marginLeft: '20px' }}>
            Cadastrar
          </Button>

          <Button
            className="shadow mt-4"
            variant="outline-primary"
            href="/"
            style={{ padding: '15px', width: '90%', borderRadius: '30px', marginLeft: '20px' }}>
            Voltar
          </Button>

          <Button
            href="/login"
            className="m-3"
            style={{
              background: "none",
              color: "black",
              border: "none"
            }}>
            ja tem uma conta? log-in
          </Button>

        </Form>
      </Container>
    </div>
  );
};

export default Cadastro;