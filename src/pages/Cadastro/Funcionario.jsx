import { useState, useEffect } from 'react';
import '../Style/login.css';
import NavBar from '../../components/NavBar/NavBar';
import { Button, Container, Dropdown, FloatingLabel, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router';

import logo from "../../assets/logo.png"

const Funcionarios = () => {
  const [nomeFuncionario, setNomeFuncionario] = useState('');
  const [emailFuncionario, setEmailFuncionario] = useState('');
  const [senhaFuncionario, setSenhaFuncionario] = useState('');
  const [confSenhaFuncionario, setConfSenhaFuncionario] = useState('');
  const [cargoFuncionario, setCargoFuncionario] = useState('Cargo');
  const [urlFuncionario, setUrlFuncionario] = useState('');
  const [filtro, setFiltro] = useState('Todos');
  const [error, setError] = useState('');
  const [palavraChave, setPalavraChave] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nomeFuncionario || !emailFuncionario || !senhaFuncionario || !confSenhaFuncionario || !urlFuncionario || !palavraChave || cargoFuncionario === 'Cargo') {
      setError('Por favor, preencha todos os campos e selecione um cargo.');
      return;
    }

    if (senhaFuncionario !== confSenhaFuncionario) {
      setError('As senhas não coincidem!');
      return;
    }

    setError('');

    try {
      const formData = new FormData();
      formData.append("nome_funcionario", nomeFuncionario);
      formData.append("email_funcionario", emailFuncionario);
      formData.append("senha_funcionario", senhaFuncionario);
      formData.append("cargo_funcionario", cargoFuncionario);
      formData.append("palavra_chave", palavraChave);
      formData.append("imagem", urlFuncionario);

      const res = await fetch("http://localhost:3000/funcionarios/insert", {
        method: "POST",
        body: formData,
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

  const cargos = [
    { label: 'Administrador', value: 'ADM' },
    { label: 'Gerente', value: 'Gerente' },
    { label: 'Funcionário', value: 'Funcionario' }
  ];

  return (
    <div style={{ marginTop: '100px' }}>
      <NavBar />

      <Container style={{ maxWidth: "800px" }}>
        <Form
          onSubmit={handleSubmit}
          className="shadow rounded"
          style={{ padding: '30px', border: '1px blue solid', textAlign: "center" }}>
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

          <FloatingLabel controlId="imagemFuncionario" label="Foto do funcionário" className="m-2">
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) => setUrlFuncionario(e.target.files[0])}
              className="rounded shadow mt-3"
              style={{ border: 'none' }}
            />
          </FloatingLabel>

          <FloatingLabel controlId="palavraChave" label="Palavra-chave" className="m-2">
            <Form.Control
              type="text"
              placeholder="Palavra-chave"
              value={palavraChave}
              onChange={(e) => setPalavraChave(e.target.value)}
              className="rounded shadow mt-3"
              style={{ border: 'none' }}
            />
          </FloatingLabel>

          {urlFuncionario && (
            <div
              className="shadow rounded mt-3 mb-4"
              style={{
                width: '65%',
                padding: '10px',
                border: '1px solid #ccc',
                textAlign: 'center',
                marginLeft: '0.6rem', // ou qualquer valor que afaste o suficiente da borda esquerda
              }}
            >
              <img
                src={URL.createObjectURL(urlFuncionario)}
                alt="Prévia da imagem"
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '10px',
                  objectFit: 'cover',
                }}
              />
            </div>
          )}

          {/* <Form.Select
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
          </Form.Select> */}

          <div className="d-flex m-2" style={{ alignContent: 'center' }}>
            <Dropdown className="d-flex shadow rounded mt-2" style={{ width: '150px', height: '60px' }}>
              <Dropdown.Toggle variant="outline-primary rounded" style={{ width: '150px', height: '60px' }}>
                {cargos.find(c => c.value === cargoFuncionario)?.label || 'Cargo'}
              </Dropdown.Toggle>
              <Dropdown.Menu className="rounded-3">
                {cargos.map(({ label, value }) => (
                  <Dropdown.Item
                    key={value}
                    onClick={() => setCargoFuncionario(value)}
                    className="dropdown-item rounded"
                  >
                    {label}
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
            style={{ width: "95%", margin: "auto" }}>
            <Button
              type="submit"
              className="shadow mt-4"
              style={{ padding: '15px', width: '50%', margin: "auto" }}>
              Cadastrar
            </Button>
            <Button
              className="shadow mt-4 rounded"
              variant="outline-danger"
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
