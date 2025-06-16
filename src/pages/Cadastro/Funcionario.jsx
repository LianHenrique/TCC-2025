import { useState } from 'react';
import '../Style/login.css'; // Importa o CSS
import NavBar from '../../components/NavBar/NavBar';
import { Button, Container, Dropdown, FloatingLabel, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router';

const Funcionarios = () => {
  const [nomeFuncionario, setNomeFuncionario] = useState('');
  const [emailFuncionario, setEmailFuncionario] = useState('');
  const [senhaFuncionario, setSenhaFuncionario] = useState('');
  const [confSenhaFuncionario, setConfSenhaFuncionario] = useState('');
  const [cargoFuncionario, setCargoFuncionario] = useState('Cargo'); // Valor padrão
  const [UrlFuncionario, setUrlFuncionario] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nomeFuncionario || !emailFuncionario || !senhaFuncionario || !confSenhaFuncionario || !UrlFuncionario || cargoFuncionario === 'Cargo') {
      console.log('Por favor, preencha todos os campos e selecione um cargo.');
      return;
    }

    if (senhaFuncionario !== confSenhaFuncionario) {
      console.log('As senhas não coincidem!');
      return;
    }

    const dados = {
      nome_funcionario: nomeFuncionario,
      email_funcionario: emailFuncionario,
      senha_funcionario: senhaFuncionario,
      cargo_funcionario: cargoFuncionario,
      imagem_url: UrlFuncionario
    };

    try {
      const res = await fetch("http://localhost:3000/funcionarios/insert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });

      if (res.ok) {
        console.log('Funcionário cadastrado com sucesso!');
        // Resetar o formulário
        setNomeFuncionario('');
        setEmailFuncionario('');
        setSenhaFuncionario('');
        setConfSenhaFuncionario('');
        setUrlFuncionario('');
        setCargoFuncionario('Cargo');
        navigate('/funcionarios');
      } else {
        console.log('Erro ao cadastrar funcionário.');
      }
    } catch (error) {
      console.error(error);
      console.log('Erro de rede ou servidor.');
    }
  };

  return (
    <div style={{ marginTop: '100px' }}>
      <NavBar />
      <Container
        style={{
          maxWidth: "800px"
        }}>
        <Form
          onSubmit={handleSubmit}
          className="shadow"
          style={{
            padding: '30px',
            borderRadius: '20px',
            border: '1px blue solid',
          }}
        >
          <h1 style={{ textAlign: 'center' }}>Cadastro</h1>

          <FloatingLabel controlId="nomeFuncionario" label="Nome" className="m-2">
            <Form.Control
              type="text"
              placeholder="Nome"
              value={nomeFuncionario}
              onChange={(e) => setNomeFuncionario(e.target.value)}
              className="rounded-5 shadow mt-3"
              style={{ border: 'none' }}
            />
          </FloatingLabel>

          <FloatingLabel controlId="emailFuncionario" label="Email" className="m-2">
            <Form.Control
              type="email"
              placeholder="Email"
              value={emailFuncionario}
              onChange={(e) => setEmailFuncionario(e.target.value)}
              className="rounded-5 shadow mt-3"
              style={{ border: 'none' }}
              showButtons={false}
            />
          </FloatingLabel>

          <FloatingLabel controlId="senhaFuncionario" label="Senha" className="m-2">
            <Form.Control
              type="password"
              placeholder="Senha"
              value={senhaFuncionario}
              onChange={(e) => setSenhaFuncionario(e.target.value)}
              className="rounded-5 shadow mt-3"
              style={{ border: 'none' }}
            />
          </FloatingLabel>

          {/* URL funcionário */}
          <FloatingLabel controlId="URl_funcionario" label="URl do funcionário" className="m-2">
            <Form.Control
              type="text"
              placeholder="URL:"
              value={UrlFuncionario}
              onChange={(e) => setUrlFuncionario(e.target.value)}
              className="rounded-5 shadow mt-3"
              style={{ border: 'none' }}
            />
          </FloatingLabel>

          <FloatingLabel controlId="confSenhaFuncionario" label="Confirmar senha" className="m-2">
            <Form.Control
              type="password"
              placeholder="Confirmar senha"
              value={confSenhaFuncionario}
              onChange={(e) => setConfSenhaFuncionario(e.target.value)}
              className="rounded-5 shadow mt-3"
              style={{ border: 'none' }}
            />
          </FloatingLabel>

          <div className="d-flex m-2" style={{ alignContent: 'center' }}>
            <Dropdown
              className="d-flex shadow rounded-5 mt-2"
              style={{ width: '150px', height: '60px' }}
            >
              <Dropdown.Toggle
                variant="outline-primary rounded-5"
                style={{ width: '150px', height: '60px' }}
              >
                {cargoFuncionario}
              </Dropdown.Toggle>
              <Dropdown.Menu className="rounded-3">
                {['Gerente', 'Estoquista', 'Geral'].map((cargo) => (
                  <Dropdown.Item
                    key={cargo}
                    onClick={() => setCargoFuncionario(cargo)}
                    className="dropdown-item rounded-5"
                  >
                    {cargo}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
            <Button
              className="rounded-5 m-2 mt-2 fs-2"
              style={{ width: '60px', height: '60px' }}
              onClick={() => {
                // Limpar formulário
                setNomeFuncionario('');
                setEmailFuncionario('');
                setSenhaFuncionario('');
                setConfSenhaFuncionario('');
                setUrlFuncionario('');
                setCargoFuncionario('Cargo');
              }}
            >
              +
            </Button>
          </div>

          <Button
            type="submit"
            className="shadow mt-4"
            style={{ padding: '15px', width: '90%', borderRadius: '30px', marginLeft: '20px' }}
          >
            Cadastrar
          </Button>
          <Button
            className="shadow mt-4"
            variant="outline-primary"
            onClick={() => navigate('/funcionarios')}
            style={{ padding: '15px', width: '90%', borderRadius: '30px', marginLeft: '20px' }}
          >
            Cancelar
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default Funcionarios;