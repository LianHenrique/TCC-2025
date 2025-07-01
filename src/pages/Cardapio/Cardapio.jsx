import { Container, Button } from 'react-bootstrap';
import NavBar from '../../components/NavBar/NavBar';
import Pesquisa from '../../components/Pesquisa/Pesquisa';
import { FaEdit, FaRegTrashAlt } from 'react-icons/fa';
import CardGeral from '../../components/Cards/CardGeral';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

const Cardapio = () => {
  const [cardapio, setCardapio] = useState([]);
  const [filtroSelecionado, setFiltroSelecionado] = useState('Todos');
  const [textoBusca, setTextoBusca] = useState('');
  const [cardapioFiltrado, setCardapioFiltrado] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const normalizeString = (str) =>
    str ? String(str).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim() : '';

  useEffect(() => {
    const fetchCardapio = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/cardapio`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erro ao buscar cardápio');
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error('Dados retornados não são um array');
        }

        const cardapioFormatado = data.map(item => {
          const imageUrl = item.imagem_url || 'https://cdn.melhoreshospedagem.com/wp/wp-content/uploads/2023/07/erro-404.jpg';

          // Verificação de estoque simplificada para demonstração
          // (Você pode manter sua lógica original se preferir)
          const estoqueInsuficiente = item.insumos.some(insumo => {
            const disponivel = Number(insumo.quantidade_insumos) || 0;
            const necessario = Number(insumo.quantidade_necessaria) || 0;
            return disponivel < necessario;
          });

          const ingredientesTexto = item.insumos.length
            ? `Ingredientes: ${item.insumos.map(i => i?.nome_insumo || i?.nome_insumos || 'Desconhecido').join(', ')}`
            : 'Ingredientes: Não informado';

          return {
            id: item.id_cardapio,
            nome: item.nome_item || 'Produto sem nome',
            imagem_url: imageUrl,
            descricao: [
              { texto: `Descrição: ${item.descricao_item || 'Sem descrição'}` },
              { texto: ingredientesTexto },
              { texto: `Preço: R$ ${Number(item.valor_item || 0).toFixed(2)}` },
              { texto: `Categoria: ${item.categoria || 'Não informada'}` }
            ],
            categoria: item.categoria || 'Não informada',
            estoqueInsuficiente,
            acoes: [
              {
                icone: <FaEdit />,
                onClick: () => navigate(`/editar_produto/${item.id_cardapio}`)
              },
              {
                icone: <FaRegTrashAlt />,
                onClick: () => handleDelete(item.id_cardapio)
              }
            ]
          };
        });

        setCardapio(cardapioFormatado);
        setError(null);
      } catch (error) {
        console.error('Erro ao buscar cardápio:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCardapio();
  }, []);

  useEffect(() => {
    let filtrado = [...cardapio];

    if (filtroSelecionado !== 'Todos') {
      const filtroNorm = normalizeString(filtroSelecionado);
      filtrado = filtrado.filter(item => normalizeString(item.categoria) === filtroNorm);
    }

    if (textoBusca.trim()) {
      const textoBuscaNorm = normalizeString(textoBusca);
      filtrado = filtrado.filter(item =>
        normalizeString(item.nome).includes(textoBuscaNorm) ||
        item.descricao?.some(d => normalizeString(d.texto).includes(textoBuscaNorm))
      );
    }

    setCardapioFiltrado(filtrado);
  }, [cardapio, filtroSelecionado, textoBusca]);


  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      fetch(`http://localhost:3000/cardapio/${id}`, { method: 'DELETE' })
        .then(res => {
          if (res.ok) setCardapio(prev => prev.filter(item => item.id !== id));
          else alert('Erro ao excluir produto');
        })
        .catch(err => console.error('Erro ao excluir:', err));
    }
  };

  const handlePedir = async (idItemCardapio, nomeProduto) => {
    try {
      console.log("Enviando id_cardapio:", idItemCardapio);

      const response = await fetch('http://localhost:3000/saida-venda', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_cardapio: idItemCardapio })
      });

      const data = await response.json();

      if (!response.ok) {
        if (data?.error?.includes('Estoque insuficiente')) {
          alert(`Não foi possível concluir o pedido:\n\n${data.error}`);

          setCardapio(prev =>
            prev.map(prod =>
              prod.nome === nomeProduto
                ? { ...prod, estoqueInsuficiente: true }
                : prod
            )
          );
        } else {
          alert('Erro ao realizar o pedido.');
        }
        return;
      }

      alert('Pedido realizado com sucesso!');
    } catch (err) {
      console.error(err);
      alert('Erro de conexão com o servidor.');
    }
  };

  return (
    <div>
      <NavBar />
      <Container style={{ marginTop: '100px' }}>
        <h1 className="fw-bold mb-2">PRODUTOS</h1>

        {loading && <p>Carregando cardápio...</p>}
        {error && (
          <div className="alert alert-danger">
            <strong>Erro:</strong> {error}
            <button
              className="btn btn-sm btn-outline-secondary ms-2"
              onClick={() => window.location.reload()}
            >
              Tentar novamente
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <Pesquisa
              nomeDrop="Filtro"
              navega="/cadastro_produto"
              TxtButton="Produtos +"
              lista={[
                { value: 'Lanche', texto: 'Lanche' },
                { value: 'Bebida', texto: 'Bebida' },
                { value: 'Sobremesa', texto: 'Sobremesa' }
              ]}
              onFilterChange={setFiltroSelecionado}
              onSearchChange={setTextoBusca}
            />
            <CardGeral
              filtro="Produtos"
              card={cardapioFiltrado}
              showButtons={false}
              onCardClick={(id) => navigate(`/Visualizar_Cardapio/${id}`)}
              customButton={(item) =>
                !item.estoqueInsuficiente && (
                  <Button
                    variant="success"
                    className="rounded-pill shadow-sm text-white px-4 py-2 mt-2"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handlePedir(item.id, item.nome);
                    }}
                  >
                    Pedir
                  </Button>
                )
              }
            />
          </>
        )}
      </Container>
    </div>
  );
};

export default Cardapio;