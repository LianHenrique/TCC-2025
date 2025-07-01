import { Container, Button } from 'react-bootstrap';
import NavBar from '../../components/NavBar/NavBar';
import Pesquisa from '../../components/Pesquisa/Pesquisa';
import { FaEdit, FaRegTrashAlt } from 'react-icons/fa';
import CardGeral from '../../components/Cards/CardGeral';
import { useEffect, useState, useCallback } from 'react'; // Adicionei useCallback
import { useNavigate } from 'react-router';

const Cardapio = () => {
  const [cardapio, setCardapio] = useState([]);
  const [filtroSelecionado, setFiltroSelecionado] = useState('Todos');
  const [textoBusca, setTextoBusca] = useState('');
  const [cardapioFiltrado, setCardapioFiltrado] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const normalizeUnidade = (unidade) => {
    const u = unidade?.toLowerCase().trim();
    if (['un', 'unidade', 'unidades'].includes(u)) return 'unidade';
    if (['g', 'grama', 'gramas'].includes(u)) return 'g';
    if (['kg', 'quilo', 'kilograma', 'quilos'].includes(u)) return 'kg';
    if (['ml', 'mililitro', 'mililitros'].includes(u)) return 'ml';
    if (['l', 'litro', 'litros'].includes(u)) return 'l';
    return u;
  };

  const convertToStockUnit = (quantidade, unidadeReceita, unidadeEstoque) => {
    const receita = normalizeUnidade(unidadeReceita);
    const estoque = normalizeUnidade(unidadeEstoque);

    if (receita === estoque) return quantidade;

    const conversoes = {
      'g->kg': val => val / 1000,
      'kg->g': val => val * 1000,
      'ml->l': val => val / 1000,
      'l->ml': val => val * 1000,
    };

    const chaveConversao = `${receita}->${estoque}`;
    if (conversoes[chaveConversao]) {
      return conversoes[chaveConversao](quantidade);
    }

    console.warn(`Conversão não suportada: ${chaveConversao}`);
    return quantidade;
  };

  const normalizeString = (str) =>
    str ? String(str).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim() : '';

  // UseCallback para memoizar a função de carregamento
  const fetchCardapio = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/cardapio?t=${Date.now()}`); // Cache busting

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao buscar cardápio');
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error('Dados retornados não são um array');
      }

      // Função de formatação movida para dentro do callback
      const formatarCardapio = (items) => {
        return items.map(item => {
          const imageUrl = item.imagem_url || 'https://cdn.melhoreshospedagem.com/wp/wp-content/uploads/2023/07/erro-404.jpg';

          const estoqueInsuficiente = item.insumos.some(insumo => {
            const quantidadeEstoque = Number(insumo.quantidade_insumos);
            const quantidadeReceita = Number(insumo.quantidade_necessaria);
            const unidadeEstoque = insumo.unidade_medida;
            const unidadeReceita = insumo.unidade_medida_receita;

            if (
              isNaN(quantidadeEstoque) ||
              isNaN(quantidadeReceita) ||
              !unidadeEstoque ||
              !unidadeReceita
            ) {
              return false;
            }

            const convertido = convertToStockUnit(quantidadeReceita, unidadeReceita, unidadeEstoque);

            if (typeof convertido !== 'number') {
              return false;
            }

            return quantidadeEstoque < convertido;
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
      };

      const cardapioFormatado = formatarCardapio(data);
      setCardapio(cardapioFormatado);
      setError(null);
    } catch (error) {
      console.error('Erro ao buscar cardápio:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [navigate]); // Adicionei navigate como dependência

  // Efeito principal para carregar dados
  useEffect(() => {
    fetchCardapio();
  }, [fetchCardapio]); // Dependência adicionada

  // Efeito para filtrar os dados
  useEffect(() => {
    let filtrado = [...cardapio];
    const filtroNorm = normalizeString(filtroSelecionado);

    if (filtroNorm && filtroNorm !== 'todos') {
      filtrado = filtrado.filter(item =>
        normalizeString(item.categoria) === filtroNorm
      );
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

  const handleDelete = useCallback(async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        const response = await fetch(`http://localhost:3000/cardapio/${id}`, { 
          method: 'DELETE' 
        });

        if (response.ok) {
          // Recarrega os dados após exclusão
          await fetchCardapio();
        } else {
          alert('Erro ao excluir produto');
        }
      } catch (err) {
        console.error('Erro ao excluir:', err);
      }
    }
  }, [fetchCardapio]); // Dependência adicionada

  const handlePedir = useCallback(async (idItemCardapio, nomeProduto) => {
    try {
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
              prod.id === idItemCardapio
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
      
      // Recarrega os dados do backend após o pedido
      await fetchCardapio();

    } catch (err) {
      console.error(err);
      alert('Erro de conexão com o servidor.');
    }
  }, [fetchCardapio]); // Dependência adicionada

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
              onClick={fetchCardapio} // Recarrega diretamente
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
                { value: 'Lanches', texto: 'Lanches' },
                { value: 'Porções', texto: 'Porções' },
                { value: 'Combos', texto: 'Combos' }
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