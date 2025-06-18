import { useState, useEffect } from 'react';
import '../Style/login.css';
import NavBar from '../../components/NavBar/NavBar';
import { Button, Container, Dropdown, FloatingLabel, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import Pesquisa from '../../components/Pesquisa/Pesquisa'; // Certifique-se de importar corretamente

const Funcionarios = () => {
  const [nomeFuncionario, setNomeFuncionario] = useState('');
  const [emailFuncionario, setEmailFuncionario] = useState('');
  const [senhaFuncionario, setSenhaFuncionario] = useState('');
  const [confSenhaFuncionario, setConfSenhaFuncionario] = useState('');
  const [cargoFuncionario, setCargoFuncionario] = useState('Cargo');
  const [urlFuncionario, setUrlFuncionario] = useState('');
  const [filtro, setFiltro] = useState('Todos');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nomeFuncionario || !emailFuncionario || !senhaFuncionario || !confSenhaFuncionario || !urlFuncionario || cargoFuncionario === 'Cargo') {
      setError('Por favor, preencha todos os campos e selecione um cargo.');
      return;
    }

    if (senhaFuncionario !== confSenhaFuncionario) {
      setError('As senhas não coincidem!');
      return;
    }

    setError('');

    const dados = {
      nome_funcionario: nomeFuncionario,
      email_funcionario: emailFuncionario,
      senha_funcionario: senhaFuncionario,
      cargo_funcionario: cargoFuncionario,
      imagem_url: urlFuncionario
    };

    try {
      const res = await fetch("http://localhost:3000/funcionarios/insert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });

      if (res.ok) {
        console.log('Funcionário cadastrado com sucesso!');
        setNomeFuncionario('');
        setEmailFuncionario('');
        setSenhaFuncionario('');
        setConfSenhaFuncionario('');
        setUrlFuncionario('');
        setCargoFuncionario('Cargo');
        navigate('/funcionarios');
      } else {
        setError('Erro ao cadastrar funcionário.');
      }
    } catch (error) {
      console.error(error);
      setError('Erro de rede ou servidor.');
    }
  };

  return (
    <div style={{ marginTop: '100px' }}>
      <NavBar />

      <Container style={{ maxWidth: "500px" }}>
        <Form
          onSubmit={handleSubmit}
          className="shadow rounded"
          style={{ padding: '30px', border: '1px blue solid' }}>

          <h1 style={{ textAlign: 'center' }}>Cadastro</h1>

          {error && (
            <div className="alert alert-danger" style={{ margin: '10px 0' }}>
              {error}
            </div>
          )}

          <FloatingLabel controlId="nomeFuncionario" label="Nome" className="m-2">
            <Form.Control
              type="text"
              placeholder="Nome"
              value={nomeFuncionario}
              onChange={(e) => setNomeFuncionario(e.target.value)}
              className="rounded shadow mt-3"
              style={{ border: 'none' }}
            />
          </FloatingLabel>

          <FloatingLabel controlId="emailFuncionario" label="Email" className="m-2">
            <Form.Control
              type="email"
              placeholder="Email"
              value={emailFuncionario}
              onChange={(e) => setEmailFuncionario(e.target.value)}
              className="rounded shadow mt-3"
              style={{ border: 'none' }}
            />
          </FloatingLabel>

          <FloatingLabel controlId="senhaFuncionario" label="Senha" className="m-2">
            <Form.Control
              type="password"
              placeholder="Senha"
              value={senhaFuncionario}
              onChange={(e) => setSenhaFuncionario(e.target.value)}
              className="rounded shadow mt-3"
              style={{ border: 'none' }}
            />
          </FloatingLabel>

          <FloatingLabel controlId="URl_funcionario" label="URl do funcionário" className="m-2">
            <Form.Control
              type="text"
              placeholder="URL:"
              value={urlFuncionario}
              onChange={(e) => setUrlFuncionario(e.target.value)}
              className="rounded shadow mt-3"
              style={{ border: 'none' }}
            />
          </FloatingLabel>

          <FloatingLabel controlId="confSenhaFuncionario" label="Confirmar senha" className="m-2">
            <Form.Control
              type="password"
              placeholder="Confirmar senha"
              value={confSenhaFuncionario}
              onChange={(e) => setConfSenhaFuncionario(e.target.value)}
              className="rounded shadow mt-3"
              style={{ border: 'none' }}
            />
          </FloatingLabel>

          <Form.Select
            aria-label="Selecione o cargo"
            value={cargoFuncionario}
            onChange={(e) => setCargoFuncionario(e.target.value)}
            className="rounded m-2"
            style={{ height: '60px' }}
          >
            <option value="Cargo" disabled>Selecione o cargo</option>
            <option value="Gerente">Gerente</option>
            <option value="Estoquista">Estoquista</option>
            <option value="Geral">Geral</option>
          </Form.Select>

          <div className="d-flex m-2" style={{ alignContent: 'center' }}>
            <Dropdown className="d-flex shadow rounded mt-2" style={{ width: '150px', height: '60px' }}>
              <Dropdown.Toggle variant="outline-primary rounded" style={{ width: '150px', height: '60px' }}>
                {cargoFuncionario}
              </Dropdown.Toggle>
              <Dropdown.Menu className="rounded-3">
                {['Gerente', 'Estoquista', 'Geral'].map((cargo) => (
                  <Dropdown.Item
                    key={cargo}
                    onClick={() => setCargoFuncionario(cargo)}
                    className="dropdown-item rounded"
                  >
                    {cargo}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
            {/* <Button
              className="rounded m-2 mt-2 fs-5"
              style={{ width: '100px', height: '60px' }}
              onClick={() => {
                setNomeFuncionario('');
                setEmailFuncionario('');
                setSenhaFuncionario('');
                setConfSenhaFuncionario('');
                setUrlFuncionario('');
                setCargoFuncionario('Cargo');
                setError('');
              }}
            >
              Limpar
            </Button> */}
          </div>

          <div className="d-flex gap-3"
            style={{ width: "95%", margin: "auto"}}>
            <Button
              type="submit"
              className="shadow mt-4"
              style={{ padding: '15px', width: '50%', margin: "auto"}}>
              Cadastrar
            </Button>
            <Button
              className="shadow mt-4 rounded"
              variant="outline-primary"
              onClick={() => navigate('/funcionarios')}
              style={{ padding: '15px', width: '50%', margin: "auto" }}>
              Cancelar
            </Button>
          </div>
        </Form>
      </Container>
    </div>
  );
};

export default Funcionarios;
