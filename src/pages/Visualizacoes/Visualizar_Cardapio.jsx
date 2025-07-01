import { useState, useEffect } from 'react';
import { Container, Form, FloatingLabel, Dropdown, Button, Badge } from 'react-bootstrap';
import NavBar from '../../components/NavBar/NavBar';
import { useParams, useNavigate } from 'react-router';

const Visualizar_Cardapio = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [produto, setProduto] = useState(null);
  const [todosInsumos, setTodosInsumos] = useState([]);
  const [insumosSelecionados, setInsumosSelecionados] = useState([]);
  const [insumoAtual, setInsumoAtual] = useState({ id: null, nome: '', quantidade: '', unidade: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const unidades = ['g', 'Kg', 'ml', 'L', 'un'];

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:3000/cardapio/${id}`)
      .then(res => res.json())
      .then(data => {
        const item = Array.isArray(data) ? data[0] : data;

        let insumosArray = [];

        if (typeof item.insumos === 'string') {
          try {
            const parsed = JSON.parse(item.insumos);
            insumosArray = Array.isArray(parsed) ? parsed : [parsed];
          } catch {
            insumosArray = [];
          }
        } else if (Array.isArray(item.insumos)) {
          insumosArray = item.insumos;
        } else if (typeof item.insumos === 'object' && item.insumos !== null) {
          insumosArray = [item.insumos];
        }

        const insumosDoProduto = insumosArray.map(insumo => ({
          id: insumo.id_insumo,
          nome: insumo.nome_insumos || '',
          quantidade_necessaria: insumo.quantidade || insumo.quantidade_necessaria || '',
          unidade_medida_receita: insumo.unidade_medida || insumo.unidade_medida_receita || '',
        }));


        setProduto(item);
        setInsumosSelecionados(insumosDoProduto);
      })
      .catch(err => {
        console.error('Erro ao carregar produto:', err);
        setError(err.message);
      });
  }, [id]);

  useEffect(() => {
    fetch('http://localhost:3000/insumos')
      .then(res => res.json())
      .then(data => setTodosInsumos(data))
      .catch(err => console.error('Erro ao carregar insumos:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduto({ ...produto, [name]: value });
  };

  const adicionarInsumo = () => {
    const { id, nome, quantidade, unidade } = insumoAtual;
    if (!id || !quantidade || !unidade) {
      alert('Preencha todos os campos do insumo.');
      return;
    }

    const jaExiste = insumosSelecionados.find(i => i.id === id);
    if (jaExiste) {
      alert('Insumo já adicionado.');
      return;
    }

    // Corrige a quantidade de acordo com a unidade
    const quantidadeCorrigida = parseFloat(quantidade);
    const unidadeNormalizada = unidade.toLowerCase();

    setInsumosSelecionados([
      ...insumosSelecionados,
      {
        id,
        nome,
        quantidade_necessaria: quantidadeCorrigida,
        unidade_medida_receita: unidadeNormalizada
      }
    ]);

    setInsumoAtual({ id: null, nome: '', quantidade: '', unidade: '' });
  };


  const removerInsumo = (id) => {
    setInsumosSelecionados(insumosSelecionados.filter(i => i.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('nome_item', produto.nome_item);
    formData.append('descricao_item', produto.descricao_item);
    formData.append('categoria', produto.categoria);
    formData.append('valor_item', produto.valor_item);

    // Envia nova imagem, se existir
    if (produto.novaImagem) {
      formData.append('imagem', produto.novaImagem);
    } else {
      formData.append('imagem_url', produto.imagem_url); // mantém a atual
    }

    formData.append('insumos', JSON.stringify(
      insumosSelecionados.map(i => ({
        id_insumo: i.id,
        quantidade_necessaria: i.quantidade_necessaria,
        unidade_medida_receita: i.unidade_medida_receita
      }))
    ));

    try {
      const res = await fetch(`http://localhost:3000/AtualizarCardapio/${id}`, {
        method: 'PUT',
        body: formData
      });

      if (res.ok) {
        alert('Produto atualizado com sucesso!');
        navigate('/cardapio');
      } else {
        alert('Erro ao atualizar produto.');
      }
    } catch (error) {
      alert('Erro de conexão com o servidor.');
    }
  };



  const handleDelete = async () => {
    const confirm = window.confirm('Deseja desativar o produto?')
    if (confirm) {
      try {
        const response = await fetch(`http://localhost:3000/delete/${id}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          throw new Error('Erro ao deletar o cardápio');
        }

        const data = await response.json();
        alert(data.message || 'Produto desativado com sucesso');
        navigate('/cardapio');
      } catch (error) {
        console.error('Erro ao excluir:', error);
        alert('Erro ao tentar excluir o item do cardápio.');
      }
    };
  }


  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error}</p>;
  if (!produto) return <p>Produto não encontrado.</p>;

  // Define URL da imagem com cache busting e fallback
  const getImagemUrl = (path) => {
    if (!path) return '';

    // Se já é uma URL completa
    if (path.startsWith('http')) return path;

    // Extrai o nome do arquivo, mesmo que venha com pasta
    const filename = path.replace(/^.*[\\/]/, '').replace(/\?.*$/, '');
    return `http://localhost:3000/uploads/${filename}`;
  };

  const imagemLink = produto.imagem_url
    ? getImagemUrl(produto.imagem_url)
    : 'https://www.valuehost.com.br/blog/wp-content/uploads/2022/01/post_thumbnail-77d8f2a95f2f41b5863f3fba5a261d7e.jpeg.webp';


  return (
    <div style={{ marginTop: '100px' }}>
      <NavBar />
      <Container style={{ maxWidth: '800px', marginBottom: '10px' }}>
        <Form onSubmit={handleSubmit} className="shadow" style={{ padding: '30px', borderRadius: '20px', border: '1px solid blue' }}>
          <h1 style={{ textAlign: 'center' }}>Editar Produto</h1>

          <FloatingLabel label="Nome" className="mb-3">
            <Form.Control
              name="nome_item"
              type="text"
              className="rounded-5 shadow"
              value={produto.nome_item || ''}
              onChange={handleInputChange}
              required />
          </FloatingLabel>

          <FloatingLabel label="Descrição" className="mb-3">
            <Form.Control
              name="descricao_item"
              as="textarea"
              className="rounded-5 shadow"
              style={{ height: '100px' }}
              value={produto.descricao_item || ''}
              onChange={handleInputChange}
              required />
          </FloatingLabel>

          <FloatingLabel label="Categoria" className="mb-3">
            <Form.Control
              name="categoria"
              type="text"
              className="rounded-5 shadow"
              value={produto.categoria || ''}
              onChange={handleInputChange}
              required />
          </FloatingLabel>

          <FloatingLabel label="Valor" className="mb-3">
            <Form.Control
              name="valor_item"
              type="number"
              className="rounded-5 shadow"
              step="0.01"
              min="0"
              value={produto.valor_item || ''}
              onChange={handleInputChange}
              required />
          </FloatingLabel>

          <FloatingLabel label="Enviar nova imagem" className="mb-3">
            <Form.Control
              type="file"
              accept="image/*"
              className="rounded-5 shadow"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setProduto({ ...produto, novaImagem: file });
                }
              }}
            />
          </FloatingLabel>

          {/* Imagem */}
          <div className="text-center mb-4">
            <img
              src={imagemLink}
              alt="Visualização do produto"
              className="img-fluid rounded"
              style={{ maxHeight: '250px', maxWidth: '100%', objectFit: 'contain' }}
              onError={e => {
                e.target.onerror = null;
                e.target.src = 'https://www.valuehost.com.br/blog/wp-content/uploads/2022/01/post_thumbnail-77d8f2a95f2f41b5863f3fba5a261d7e.jpeg.webp';
              }}
            />
          </div>

          <div className="d-flex align-items-center mb-3 gap-2">
            <Dropdown className="shadow rounded-5">
              <Dropdown.Toggle variant="outline-primary rounded-5">
                {insumoAtual.nome || 'Insumos'}
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {todosInsumos.map(insumo => (
                  <Dropdown.Item
                    key={insumo.id_insumos}
                    onClick={() =>
                      setInsumoAtual({
                        ...insumoAtual,
                        id: insumo.id_insumos,
                        nome: insumo.nome_insumos,
                      })
                    }>
                    {insumo.nome_insumos}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>

            <Form.Control
              type="number"
              placeholder="Qtd"
              className="shadow rounded-5"
              style={{ width: '120px' }}
              value={insumoAtual.quantidade}
              onChange={(e) => setInsumoAtual({ ...insumoAtual, quantidade: e.target.value })}
              min="0"
            />

            <Dropdown className="shadow rounded-5">
              <Dropdown.Toggle variant="outline-primary rounded-5">
                {insumoAtual.unidade || 'Unidade'}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {unidades.map((uni, idx) => (
                  <Dropdown.Item
                    key={idx}
                    onClick={() =>
                      setInsumoAtual({ ...insumoAtual, unidade: uni })
                    }>
                    {uni}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>

            <Button variant="primary" className="rounded-5" onClick={adicionarInsumo}>
              +
            </Button>
          </div>

          {/* Campo azul falando os insumos relacionados */}
          <div className="mb-3">
            {insumosSelecionados.length > 0 ? (
              insumosSelecionados.map((i) => (
                <Badge
                  key={i.id}
                  pill
                  bg="primary"
                  className="m-1 rounded-5"
                  style={{ cursor: 'pointer', padding: '10px' }}
                  onClick={() => removerInsumo(i.id)}
                >
                  {i.nome} — {i.quantidade_necessaria} {i.unidade_medida_receita} ✕
                </Badge>
              ))
            ) : (
              <p className="text-muted">Nenhum insumo adicionado</p>
            )}
          </div>


          <Button type="submit" className="shadow mt-4" style={{ padding: '15px', width: '100%', borderRadius: '30px' }}>
            Salvar Alterações
          </Button>

          <Button type="button" variant='danger' className="shadow mt-4" style={{ padding: '15px', width: '100%', borderRadius: '30px' }}
            onClick={() => handleDelete()}>
            Desativar Cardapio
          </Button>

          <Button
            variant="outline-primary"
            type="button"
            onClick={() => navigate('/cardapio')}
            className="shadow mt-2"
            style={{ padding: '15px', width: '100%', borderRadius: '30px' }}>
            Cancelar
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default Visualizar_Cardapio;