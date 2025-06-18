
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
  const [imagemUrl, setImagemUrl] = useState('');
  const [insumos, setInsumos] = useState([]);
  const [insumoSelecionado, setInsumoSelecionado] = useState({
    id: null,
    nome: '',
    quantidade_necessaria: '',
    unidade_medida_receita: ''
  });
  const [insumosSelecionados, setInsumosSelecionados] = useState([]);

  const navigate = useNavigate();

  const uni = ["g", "Kg"];

  useEffect(() => {
    fetch('http://localhost:3000/insumos')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setInsumos(data);
        else setInsumos([]);
      })
      .catch(() => setInsumos([]));
  }, []);

  const adicionarInsumo = () => {
    const { id, nome, quantidade_necessaria, unidade_medida_receita } = insumoSelecionado;
    if (!id || !quantidade_necessaria || !unidade_medida_receita) return alert('Preencha todos os campos do insumo.');
    const jaExiste = insumosSelecionados.find((i) => i.id === id);
    if (jaExiste) return alert('Insumo já adicionado!');
    setInsumosSelecionados([...insumosSelecionados, { id, nome, quantidade_necessaria, unidade_medida_receita }]);
    setInsumoSelecionado({ id: null, nome: '', quantidade_necessaria: '', unidade_medida_receita: '' });
  };

  const removerInsumo = (id) => setInsumosSelecionados(insumosSelecionados.filter((i) => i.id !== id));

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
      imagem_url: imagemUrl,
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
      alert('Erro ao conectar ao servidor.');
    }
  };

  return (
    <div style={{ marginTop: '100px' }}>
      <NavBar />
      <Container
      style={{
          maxWidth: "500px"
        }}>
        <Form
          onSubmit={handleSubmit}
          className="shadow"
          style={{
            padding: '30px',
            borderRadius: '20px',
            border: '1px solid blue'
          }}>
          <h1 style={{ textAlign: 'center' }}>Cadastro</h1>

          <FloatingLabel
            controlId="floatingNome"
            label="Nome"
            className="m-2">
            <Form.Control
              type="text"
              placeholder="Nome"
              className="rounded-5 shadow mt-3"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required />
          </FloatingLabel>

          <div className="d-flex align-items-center m-2 gap-2">
            {/* Seleção de insumo */}
            <Dropdown className="shadow rounded-5">
              <Dropdown.Toggle variant="outline-primary rounded-5">
                {insumoSelecionado.nome || 'Insumos'}
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {insumos.map(({ nome_insumos, id_insumos }) => (
                  <Dropdown.Item
                    key={`insumo-${id_insumos}`}
                    onClick={() =>
                      setInsumoSelecionado((prev) => ({
                        ...prev,
                        id: id_insumos,
                        nome: nome_insumos,
                      }))
                    }
                  >
                    {nome_insumos}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>

            {/* Quantidade */}
            <Form.Control
              type="number"
              placeholder="Quantidade"
              value={insumoSelecionado.quantidade_necessaria}
              onChange={(e) =>
                setInsumoSelecionado((prev) => ({
                  ...prev,
                  quantidade_necessaria: e.target.value,
                }))
              }
              className="shadow rounded-5"
              style={{ width: '150px' }}
              min="0"
            />

            {/* Unidade de medida */}
            <Dropdown className="shadow rounded-5">
              <Dropdown.Toggle
                variant="outline-primary rounded-5">
                {insumoSelecionado.unidade_medida_receita || 'Unidade'}
              </Dropdown.Toggle>
              <Dropdown.Menu
                style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {uni.map((nome, index) => (
                  <Dropdown.Item
                    key={`uni-${index}`}
                    onClick={() =>
                      setInsumoSelecionado((prev) => ({
                        ...prev,
                        unidade_medida_receita: nome,
                      }))
                    }
                  >
                    {nome}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>

            {/* Botão de adicionar */}
            <Button variant="primary" onClick={adicionarInsumo} className="rounded-5">
              +
            </Button>
          </div>

          <div className="m-2">
            {insumosSelecionados.length > 0 ? (
              insumosSelecionados.map((i) => (
                <Badge key={i.id} pill bg="primary"
                  className="m-1 rounded-5" style={{ cursor: 'pointer', padding: '10px' }}
                  onClick={() => removerInsumo(i.id)}>
                  {i.nome} — {i.quantidade_necessaria} {i.unidade_medida_receita} ✕
                </Badge>
              ))
            ) : (
              <p className="text-muted m-2">Nenhum insumo adicionado</p>
            )}
          </div>

          <FloatingLabel
            controlId="floatingImagem"
            label="URL da Imagem"
            className="m-2">
            <Form.Control
              type="text"
              className="rounded-5 shadow mt-3"
              placeholder="URL da imagem"
              value={imagemUrl}
              onChange={(e) =>
                setImagemUrl(e.target.value)} />
          </FloatingLabel>

          <FloatingLabel 
          controlId="floatingValor" 
          label="Valor" 
          className="m-2">
            <Form.Control 
            type="number" 
            placeholder="Valor" 
            className="rounded-5 shadow mt-3"
            value={valor} 
            onChange={(e) => setValor(e.target.value)} 
            required 
            min="0" 
            step="0.01" />
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
