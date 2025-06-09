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
  const [insumos, setInsumos] = useState([]);
  const [insumoSelecionado, setInsumoSelecionado] = useState({
    id: null,
    nome: '',
    quantidade_necessaria: '',
    unidade_medida_receita: ''
  });
  const [insumosSelecionados, setInsumosSelecionados] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3000/insumos')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setInsumos(data);
        } else {
          console.error('API retornou algo inesperado:', data);
          setInsumos([]); // evita travar o componente
        }
      })
      .catch((error) => {
        console.error('Erro ao buscar insumos:', error);
        setInsumos([]); // fallback em caso de erro
      });
  }, []);


  const adicionarInsumo = () => {
    const { id, nome, quantidade_necessaria, unidade_medida_receita } = insumoSelecionado;

    if (!id || !quantidade_necessaria || !unidade_medida_receita) {
      alert('Preencha todos os campos do insumo.');
      return;
    }

    const jaExiste = insumosSelecionados.find((i) => i.id === id);
    if (jaExiste) {
      alert('Insumo já adicionado!');
      return;
    }

    setInsumosSelecionados([
      ...insumosSelecionados,
      {
        id,
        nome,
        quantidade_necessaria,
        unidade_medida_receita
      }
    ]);

    setInsumoSelecionado({
      id: null,
      nome: '',
      quantidade_necessaria: '',
      unidade_medida_receita: ''
    });
  };

  const removerInsumo = (id) => {
    setInsumosSelecionados(insumosSelecionados.filter((i) => i.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nome || !descricao || !filtro || insumosSelecionados.length === 0 || !valor) {
      alert('Preencha todos os campos e adicione pelo menos um insumo.');
      return;
    }

    const produto = {
      nome_produto: nome,
      descricao_produto: descricao,
      filtro,
      valor_produto: parseFloat(valor),
      insumos: insumosSelecionados.map((i) => ({
        id_insumo: i.id,
        quantidade_necessaria: parseFloat(i.quantidade_necessaria),
        unidade_medida_receita: i.unidade_medida_receita
      }))
    };

    try {
      const res = await fetch('http://localhost:3000/cardapio/insert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(produto),
      });

      if (res.ok) {
        alert('Produto cadastrado com sucesso!');
        navigate('/cardapio');
      } else {
        const data = await res.json();
        alert('Erro: ' + (data.error || 'Não foi possível cadastrar o produto.'));
      }
    } catch (error) {
      console.error('Erro ao conectar ao servidor.', error);
      alert('Erro ao conectar ao servidor.');
    }
  };

  return (
    <div style={{ marginTop: '90px' }}>
      <NavBar />
      <Container>
        <Form onSubmit={handleSubmit} className="shadow" style={{ padding: '30px', borderRadius: '20px', border: '1px solid blue' }}>
          <h1 style={{ textAlign: 'center' }}>Cadastro</h1>

          <FloatingLabel controlId="floatingNome" label="Nome" className="m-2">
            <Form.Control type="text" placeholder="Nome" className="rounded-5 shadow mt-3" value={nome} onChange={(e) => setNome(e.target.value)} required />
          </FloatingLabel>

          <div className="d-flex align-items-center m-2 gap-2">
            <Dropdown className="shadow rounded-5">
              <Dropdown.Toggle variant="outline-primary rounded-5">
                {insumoSelecionado.nome || 'Insumos'}
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {insumos.map(({ nome_produto, id_produto }) => (
                  <Dropdown.Item
                    key={id_produto}
                    onClick={() => setInsumoSelecionado((prev) => ({ ...prev, id: id_produto, nome: nome_produto }))}>
                    {nome_produto}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>

            <Form.Control
              type="number"
              placeholder="Qtd"
              value={insumoSelecionado.quantidade_necessaria}
              onChange={(e) => setInsumoSelecionado((prev) => ({ ...prev, quantidade_necessaria: e.target.value }))}
              className="shadow"
              style={{ width: '100px' }}
              min="0"
            />

            <Form.Control
              type="text"
              placeholder="Unidade"
              value={insumoSelecionado.unidade_medida_receita}
              onChange={(e) => setInsumoSelecionado((prev) => ({ ...prev, unidade_medida_receita: e.target.value }))}
              className="shadow"
              style={{ width: '100px' }}
            />

            <Button variant="success" onClick={adicionarInsumo}>+</Button>
          </div>

          <div className="m-2">
            {insumosSelecionados.length > 0 ? (
              insumosSelecionados.map((i) => (
                <Badge
                  key={i.id}
                  pill
                  bg="primary"
                  className="m-1"
                  style={{ cursor: 'pointer', padding: '10px' }}
                  onClick={() => removerInsumo(i.id)}>
                  {i.nome} — {i.quantidade_necessaria} {i.unidade_medida_receita} ✕
                </Badge>
              ))
            ) : (
              <p className="text-muted m-2">Nenhum insumo adicionado</p>
            )}
          </div>

          <FloatingLabel controlId="floatingValor" label="Valor" className="m-2">
            <Form.Control type="number" placeholder="Valor" value={valor} onChange={(e) => setValor(e.target.value)} required min="0" step="0.01" />
          </FloatingLabel>

          <FloatingLabel controlId="floatingDescricao" label="Descrição" className="m-2">
            <Form.Control type="text" placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} required />
          </FloatingLabel>

          <div className="d-flex m-2">
            <Dropdown className="shadow rounded-5 mt-2">
              <Dropdown.Toggle variant="outline-primary rounded-5">
                {filtro || 'Filtro'}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {['Lanches', 'Bebidas', 'Acompanhamentos'].map((item) => (
                  <Dropdown.Item key={item} onClick={() => setFiltro(item)}>{item}</Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>

          <Button type="submit" className="shadow mt-4" style={{ padding: '15px', width: '90%', borderRadius: '30px', marginLeft: '20px' }}>
            Cadastrar
          </Button>

          <Button type="button" className="shadow mt-4" variant="outline-primary" onClick={() => navigate('/cardapio')} style={{ padding: '15px', width: '90%', borderRadius: '30px', marginLeft: '20px' }}>
            Cancelar
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default Produto;
