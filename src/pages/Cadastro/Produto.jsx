import React, { useEffect, useState } from 'react';
import '../Style/login.css';
import NavBar from '../../components/NavBar/NavBar';
import { Button, Container, Dropdown, FloatingLabel, Form, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Produto = () => {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [filtro, setFiltro] = useState('');
  const [valor, setValor] = useState('');
  const [insumoSelecionado, setInsumoSelecionado] = useState(null);
  const [insumos, setInsumos] = useState([]);
  const [insumosSelecionados, setInsumosSelecionados] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3000/insumos')
      .then((res) => res.json())
      .then((data) => setInsumos(data))
      .catch((error) => console.error('Erro ao buscar insumos:', error));
  }, []);

  const adicionarInsumo = () => {
    if (!insumoSelecionado) return;
    const jaExiste = insumosSelecionados.find((i) => i.id === insumoSelecionado.id);
    if (jaExiste) {
      alert('Insumo já adicionado!');
      return;
    }
    setInsumosSelecionados([...insumosSelecionados, insumoSelecionado]);
    setInsumoSelecionado(null);
  };

  const removerInsumo = (id) => {
    setInsumosSelecionados(insumosSelecionados.filter((i) => i.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nome || !descricao || !filtro || insumosSelecionados.length === 0 || !valor) {
      console.log('Preencha todos os campos e adicione pelo menos um insumo.');
      return;
    }

    const produto = {
      nome_produto: nome,
      descricao_produto: descricao,
      filtro,
      valor_produto: parseFloat(valor),
      insumos: insumosSelecionados.map((i) => i.id)
    };

    try {
      const res = await fetch('http://localhost:3000/cardapio/insert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(produto),
      });

      if (res.ok) {
        console.log('Produto cadastrado com sucesso!');
        navigate('/cardapio');
      } else {
        const data = await res.json();
        console.log('Erro: ' + (data.error || 'Não foi possível cadastrar o produto.'));
      }
    } catch (error) {
      console.log('Erro ao conectar ao servidor.');
      console.error(error);
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
            border: '1px solid blue',
            marginBottom: "10px"
          }}
        >
          <h1 style={{ textAlign: 'center' }}>Cadastro</h1>

          <FloatingLabel controlId="floatingNome" label="Nome" className="m-2">
            <Form.Control
              type="text"
              placeholder="Nome"
              className="rounded-5 shadow mt-3"
              style={{ border: 'none' }}
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </FloatingLabel>

          {/* Dropdown de Insumos com botão de adicionar */}
          <div className="d-flex align-items-center m-2 gap-2" style={{ paddingTop: '10px' }}>
            <Dropdown className="shadow rounded-5" style={{ height: '60px' }}>
              <Dropdown.Toggle
                variant="outline-primary rounded-5"
                style={{ width: 'auto', height: '60px' }}
              >
                {insumoSelecionado ? insumoSelecionado.nome : 'Insumo'}
              </Dropdown.Toggle>
              <Dropdown.Menu className="rounded-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {insumos.map(({ nome_produto, id_produto }) => (
                  <Dropdown.Item
                    key={id_produto}
                    onClick={() => setInsumoSelecionado({ id: id_produto, nome: nome_produto })}
                  >
                    {nome_produto}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
            <Button
              className="rounded-5 fs-2"
              style={{ width: '60px', height: '60px' }}
              type="button"
              onClick={adicionarInsumo}
            >
              +
            </Button>
          </div>

          {/* Lista de Insumos Adicionados */}
          <div className="m-2">
            {insumosSelecionados.length > 0 ? (
              <div>
                {insumosSelecionados.map((i) => (
                  <Badge
                    key={i.id}
                    pill
                    bg="primary"
                    className="m-1"
                    style={{ cursor: 'pointer', padding: '10px' }}
                    onClick={() => removerInsumo(i.id)}
                  >
                    {i.nome} ✕
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-muted m-2">Nenhum insumo adicionado</p>
            )}
          </div>

          <FloatingLabel controlId="floatingValor" label="Valor" className="m-2">
            <Form.Control
              type="number"
              placeholder="Valor"
              className="rounded-5 shadow mt-3"
              style={{ border: 'none' }}
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              required
              min="0"
              step="0.01"
            />
          </FloatingLabel>

          <FloatingLabel controlId="floatingDescricao" label="Descrição" className="m-2">
            <Form.Control
              type="text"
              placeholder="Descrição"
              className="rounded-5 shadow mt-3"
              style={{ border: 'none' }}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
            />
          </FloatingLabel>

          <div className="d-flex m-2" style={{ alignContent: 'center' }}>
            <Dropdown className="shadow rounded-5 mt-2" style={{ width: '150px', height: '60px' }}>
              <Dropdown.Toggle variant="outline-primary rounded-5" style={{ width: '150px', height: '60px' }}>
                {filtro || 'Filtro'}
              </Dropdown.Toggle>
              <Dropdown.Menu className="rounded-3">
                {['Lanches', 'Bebidas', 'Acompanhamentos'].map((item) => (
                  <Dropdown.Item key={item} onClick={() => setFiltro(item)}>
                    {item}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>

          <Button
            type="submit"
            className="shadow mt-4"
            style={{ padding: '15px', width: '90%', borderRadius: '30px', marginLeft: '20px' }}
          >
            Cadastrar
          </Button>

          <Button
            type="button"
            className="shadow mt-4"
            variant="outline-primary"
            onClick={() => navigate('/cardapio')}
            style={{ padding: '15px', width: '90%', borderRadius: '30px', marginLeft: '20px' }}
          >
            Cancelar
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default Produto;