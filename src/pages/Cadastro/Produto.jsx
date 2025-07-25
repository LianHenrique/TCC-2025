
import React, { useEffect, useState } from 'react';
import '../Style/login.css';
import NavBar from '../../components/NavBar/NavBar';
import { Button, Container, Dropdown, FloatingLabel, Form, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import logo from "../../assets/logo.png"

const Produto = () => {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [filtro, setFiltro] = useState('');
  const [valor, setValor] = useState('');
  const [imagemUrl, setImagemUrl] = useState('');
  const [insumos, setInsumos] = useState([]);
  const [unidade, setUnidade] = useState([]);
  const [quantidade, setQuantidade] = useState('');
  const [imagemArquivo, setImagemArquivo] = useState(null);
  const [insumoSelecionado, setInsumoSelecionado] = useState({
    id: null,
    nome: '',
    quantidade_necessaria: '',
    unidade_medida_receita: ''
  });
  const [insumosSelecionados, setInsumosSelecionados] = useState([]);
  const categoriasValidas = ['Lanches', 'Porções', 'Combos'];

  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3000/unidades-medida')
      .then(res => res.json())
      .then(data => setUnidade(data))
      .catch(() => setUnidade(['unidade', 'kg', 'litro', 'g', 'ml']));
  }, []);

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
    const jaExiste = insumosSelecionados.find((i) => i.id_insumo === id);
    if (jaExiste) return alert('Insumo já adicionado!');
    setInsumosSelecionados([...insumosSelecionados, {
      id_insumo: id,
      nome,
      quantidade_necessaria,
      unidade_medida_receita
    }]);
    setInsumoSelecionado({ id: null, nome: '', quantidade_necessaria: '', unidade_medida_receita: '' });
  };

  const removerInsumo = (id) => setInsumosSelecionados(insumosSelecionados.filter((i) => i.id !== id));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nome || !descricao || !filtro || insumosSelecionados.length === 0 || !valor || !imagemArquivo) {
      alert('Preencha todos os campos e adicione pelo menos um insumo.');
      return;
    }

    const formData = new FormData();
    formData.append('nome_produto', nome);
    formData.append('descricao_produto', descricao);
    formData.append('valor_produto', valor);
    formData.append('categoria', filtro);
    formData.append('imagem', imagemArquivo); // <- imagem real
    formData.append('insumos', JSON.stringify(insumosSelecionados));

    try {
      const res = await fetch('http://localhost:3000/cardapio/insert', {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        alert('Produto cadastrado com sucesso!');
        navigate('/cardapio');
      } else {
        const data = await res.json();
        alert('Erro: ' + (data.error || 'Não foi possível cadastrar o produto.'));
      }
    } catch (error) {
      alert('Erro ao conectar ao servidor: ' + error.message);
    }
  };

  const handleReset = () => {
    setInsumoSelecionado({
      nome_item: '',
      descricao_item: '',
      categoria: 'Outros',
      valor_item: 0,
      imagem_url: ''
    });
  };

  const validarProduto = () => {
    if (!nome || !insumos || !quantidade || !unidade || !imagemUrl || !valor || !descricao || !filtro) { //removido cnpj
      alert('Todos os campos são obrigatórios!');
      return false;
    }

    if (insumosSelecionados.nome_item < 4) {
      alert('O nome deve ter pello menos 4 caracteres!');
      return false;
    }


    if (!insumosSelecionados.imagem_url) {
      alert('A URL da imagem é obrigatória.');
      return false;
    }

    if (insumosSelecionados.descricao_item < 1) {
      alert('O nome deve ter pello menos 1 caracteres!');
      return false;
    }

    if (insumosSelecionados.valor_item <= 0) {
      alert('O valor deve ser maior que zero.');
      return;
    }

    return true;


  }

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
            border: '1px solid blue', textAlign: "center"
          }}>
          <img
            src={logo} width={100} alt="" />
          <h1 style={{ textAlign: 'center' }}>Cadastro</h1>

          <FloatingLabel
            controlId="floatingNome"
            label="Nome"
            className="m-2">
            <Form.Control
              type="text"
              placeholder="Nome"
              className="rounded shadow mt-3"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required />
          </FloatingLabel>

          <div className="d-flex align-items-center m-2 gap-2">
            {/* Seleção de insumo */}
            <Dropdown className="shadow rounded">
              <Dropdown.Toggle variant="outline-primary rounded">
                {insumoSelecionado.nome || 'Insumos'}
              </Dropdown.Toggle>
              <Dropdown.Menu>
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
              type="text"
              placeholder="Quantidade"
              value={insumoSelecionado.quantidade_necessaria}
              onChange={(e) => {
                let valorDigitado = e.target.value;

                valorDigitado = valorDigitado.replace(/[^\d,]/g, '').replace('.', '');

                const valor = parseFloat(valorDigitado.replace(',', '.'));

                setInsumoSelecionado((prev) => ({
                  ...prev,
                  quantidade_necessaria: isNaN(valor) ? '' : valor
                }));
              }}
              className="shadow rounded"
              style={{ width: '150px' }}
            />

            {/* Unidade de medida */}
            <Dropdown className="shadow rounded">
              <Dropdown.Toggle
                variant="outline-primary rounded">
                {insumoSelecionado.unidade_medida_receita || 'Unidade'}
              </Dropdown.Toggle>
              <Dropdown.Menu
                style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {unidade.map((nome, index) => (
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
            <Button variant="primary" onClick={adicionarInsumo} className="rounded">
              +
            </Button>
          </div>

          <div className="m-2">
            {insumosSelecionados.length > 0 ? (
              insumosSelecionados.map((i) => (
                <Badge key={i.id_insumo}
                pill bg = "primary"
                  className = "m-1 rounded" style = {{ cursor: 'pointer', padding: '10px' }}
            onClick={() => removerInsumo(i.id)}>
            {i.nome} — {i.quantidade_necessaria} {i.unidade_medida_receita} ✕
          </Badge>
          ))
          ) : (
          <p className="m-2">Nenhum insumo adicionado</p>
            )}
        </div>

        <Form.Group className="m-2" controlId="formImagem">
          <Form.Control
            type="file"
            accept="image/*"
            onChange={(e) => setImagemArquivo(e.target.files[0])}
            className="rounded-5 shadow mt-3"
          />
        </Form.Group>

        <FloatingLabel
          controlId="floatingValor"
          label="Valor"
          className="m-2">
          <Form.Control
            type="number"
            placeholder="Valor"
            className="rounded shadow mt-3"
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
            className="rounded shadow mt-3"
            style={{ border: 'none', height: '100px' }}
          />
        </FloatingLabel>

        <div className="d-flex m-2">
          <Dropdown className="shadow rounded mt-2">
            <Dropdown.Toggle variant="outline-primary rounded">
              {filtro || 'Categoria'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {categoriasValidas.map((item) => (
                <Dropdown.Item key={item} onClick={() => setFiltro(item)}>{item}</Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <div className="d-flex justify-content-center gap-3" style={{ width: "95%", margin: "auto" }}>
          <Button type="submit" className="shadow mt-4 rounded" style={{ padding: '15px', width: '50%' }}>
            Cadastrar
          </Button>
          <Button variant="outline-danger" onClick={() => navigate('/cardapio')} className="shadow mt-4 rounded" style={{ padding: '15px', width: '50%' }}>
            Cancelar
          </Button>
        </div>

      </Form>
    </Container>
    </div >
  );
};

export default Produto;
