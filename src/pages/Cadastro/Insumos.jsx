
import { useState } from 'react';
import '../Style/login.css'; // Importa o CSS
import NavBar from '../../components/NavBar/NavBar';
import { Button, Container, Dropdown, FloatingLabel, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router';

const Insumos = () => {
  const [nomeinsumos, setNomeinsumos] = useState('');
  const [valorinsumos, setValorinsumos] = useState('');
  const [dataValidade, setDataValidade] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [filtro, setFiltro] = useState('Filtro');
  const [descricao, setDescricao] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nomeinsumos || !valorinsumos || !dataValidade || !quantidade || filtro === 'Filtro') {
      console.log('Por favor, preencha todos os campos e escolha um filtro');
      return;
    }

    if (new Date(dataValidade) < new Date(today)) {
      console.log('A data de validade deve ser hoje ou uma data futura.');
      return;
    }

    const dados = {
      nome_insumos: nomeinsumos,
      valor_insumos: valorinsumos,
      categoria: filtro,
      quantidade_insumos: quantidade,
      data_vencimento: dataValidade,
      descricao_insumos: descricao,
    };

    try {
      const res = await fetch("http://localhost:3000/insumos/insert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });

      if (res.ok) {
        console.log("Insumo cadastrado com sucesso!");
        // Resetar o formulário, se quiser:
        setNomeinsumos('');
        setValorinsumos('');
        setDataValidade('');
        setQuantidade('');
        setFiltro('Filtro');
        setDescricao('');
        navigate('/estoque'); // redireciona após sucesso
      } else {
        console.log("Erro ao cadastrar insumo");
      }
    } catch (error) {
      console.log("Erro de rede ou servidor");
      console.error(error);
    }
  };

  const today = new Date().toISOString().split('T')[0];

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
            marginBottom: "10px"
          }}
        >
          <h1 style={{ textAlign: 'center' }}>Cadastro</h1>

          <FloatingLabel controlId="nomeinsumos" label="Nome" className="m-2">
            <Form.Control
              type="text"
              placeholder="Nome"
              value={nomeinsumos}
              onChange={(e) => setNomeinsumos(e.target.value)}
              className="rounded-5 shadow mt-3"
              style={{ border: 'none' }}
            />
          </FloatingLabel>

          <FloatingLabel controlId="valorinsumos" label="Valor unidade" className="m-2">
            <Form.Control
              type="number"
              step="0.01"
              placeholder="Valor unidade"
              value={valorinsumos}
              onChange={(e) => setValorinsumos(e.target.value)}
              className="rounded-5 shadow mt-3"
              style={{ border: 'none' }}
            />
          </FloatingLabel>

          <FloatingLabel controlId="dataValidade" label="Data de validade" className="m-2">
            <Form.Control
              type="date"
              placeholder="Data de validade"
              value={dataValidade}
              min={today}
              onChange={(e) => setDataValidade(e.target.value)}
              className="rounded-5 shadow mt-3"
              style={{ border: 'none' }}
            />
          </FloatingLabel>

          <FloatingLabel controlId="quantidade" label="Quantidade" className="m-2">
            <Form.Control
              type="number"
              placeholder="Quantidade"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              className="rounded-5 shadow mt-3"
              style={{ border: 'none' }}
            />
          </FloatingLabel>

          <FloatingLabel controlId="descricao" label="Descrição" className="m-2">
            <Form.Control
              as="textarea"
              placeholder="Descrição"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="rounded-5 shadow mt-3"
              style={{ border: 'none', height: '100px' }}
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
                {filtro}
              </Dropdown.Toggle>
              <Dropdown.Menu className="rounded-3">
                {['Carnes', 'Bebidas', 'Saladas'].map((item) => (
                  <Dropdown.Item
                    key={item}
                    onClick={() => setFiltro(item)}
                    className="dropdown-item rounded-5"
                  >
                    {item}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
            <Button
              className="rounded-5 m-2 mt-2 fs-2"
              style={{ width: '60px', height: '60px' }}
              onClick={() => {
                // Limpar formulário se quiser
                setNomeinsumos('');
                setValorinsumos('');
                setDataValidade('');
                setQuantidade('');
                setFiltro('Filtro');
                setDescricao('');
              }}
            >
              +
            </Button>
          </div>

          <Button
            type="submit"
            className="shadow mt-4"
            style={{
              padding: '15px',
              width: '90%',
              borderRadius: '30px',
              marginLeft: '20px',
            }}
          >
            Cadastrar
          </Button>
          <Button
            className="shadow mt-4"
            variant="outline-primary"
            onClick={() => navigate('/estoque')}
            style={{
              padding: '15px',
              width: '90%',
              borderRadius: '30px',
              marginLeft: '20px',
            }}
          >
            Cancelar
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default Insumos;
