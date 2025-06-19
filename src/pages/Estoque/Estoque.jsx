import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import NavBar from '../../components/NavBar/NavBar';
import Pesquisa from '../../components/Pesquisa/Pesquisa';
import { Button, Container, Badge } from 'react-bootstrap';
import CardGeral from '../../components/Cards/CardGeral';
import { FaEdit, FaRegTrashAlt } from 'react-icons/fa';
import AlertaSobre from '../../components/AlertaSobre/AlertaSobre';

const Estoque = () => {
  const [produtos, setProdutos] = useState({});
  const [produtosFiltrados, setProdutosFiltrados] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroAtivo, setFiltroAtivo] = useState('Todos');
  const navigate = useNavigate();

  // Função segura para normalizar strings
  const normalizeString = (str) => {
    if (!str) return '';
    return String(str)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  };

  const handleCardClick = (id) => {
    navigate(`/visualizar/${id}`);
    console.log('Indo para a tela de visulizar')
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Deseja realmente deletar este item do estoque?');
    if(!confirm) return;

    try {
      const response = await await fetch(`http://localhost:3000/insumos/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar o item');
      }

      alert('Insumo desativado com sucesso')

      const data = await response.json();

      setProdutos(prev => {
        const newProdutos = { ...prev };
        for (const categoriaKey in newProdutos) {
          newProdutos[categoriaKey].items = newProdutos[categoriaKey].items.filter(p => p.id !== id);
          if (newProdutos[categoriaKey].items.length === 0) {
            delete newProdutos[categoriaKey];
          }
        }
        return newProdutos;
      });

      setProdutosFiltrados(prev => {
        const newProdutos = { ...prev };
        for (const categoriaKey in newProdutos) {
          newProdutos[categoriaKey].items = newProdutos[categoriaKey].items.filter(p => p.id !== id);
          if (newProdutos[categoriaKey].items.length === 0) {
            delete newProdutos[categoriaKey];
          }
        }
        return newProdutos;
      });

    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao deletar item: ' + error.message);
    }
  };


  const handleEdit = (id) => {
    navigate(`/editar/${id}`);
  };

  const handleFiltroChange = (filtroSelecionado) => {
    if (!filtroSelecionado) return;

    setFiltroAtivo(filtroSelecionado);

    if (filtroSelecionado === 'Todos') {
      setProdutosFiltrados(produtos);
      return;
    }

    const filtroNormalizado = normalizeString(filtroSelecionado);
    const filtrados = {};

    // Iterate over the normalized keys of 'produtos'
    for (const normalizedCategoryKey in produtos) {
      if (normalizedCategoryKey === filtroNormalizado) {
        filtrados[normalizedCategoryKey] = produtos[normalizedCategoryKey];
      }
    }

    setProdutosFiltrados(filtrados);
  };

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await fetch('http://localhost:3000/estoque');
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Resposta inesperada da API - esperado array");
        }

        const agrupados = data.reduce((acc, insumo) => {
          const originalCat = insumo.categoria || 'Outros';
          const normalizedCatKey = normalizeString(originalCat);

          if (!acc[normalizedCatKey]) {
            acc[normalizedCatKey] = {
              displayName: originalCat,
              items: []
            };
          }

          const vencimentoFormatado = insumo.data_vencimento
            ? new Date(insumo.data_vencimento).toLocaleDateString('pt-BR')
            : 'Sem data';

          const valorNumerico = parseFloat(insumo.valor_insumos) || 0;
          const valorFormatado = isNaN(valorNumerico)
            ? 'Valor inválido'
            : `R$ ${valorNumerico.toFixed(2)}`;

          const statusEstoque = insumo.quantidade_insumos <= 5
            ? 'danger'
            : insumo.quantidade_insumos <= 10
              ? 'warning'
              : 'success';

          acc[normalizedCatKey].items.push({
            id: insumo.id_insumos,
            nome: insumo.nome_insumos,
            dataVencimento: vencimentoFormatado,
            quantidade: insumo.quantidade_insumos,
            unidade: insumo.unidade_medida,
            valor: valorNumerico,
            statusEstoque,
            link: insumo.imagem_url || 'https://cdn.melhoreshospedagem.com.br/wp/wp-content/uploads/2023/07/erro-404.jpg',
            descricao: [
              {
                texto: `Quantidade: ${insumo.quantidade_insumos} ${insumo.unidade_medida}`,
                badge: statusEstoque
              },
              { texto: `Valor unitário: ${valorFormatado}` },
              { texto: `Vencimento: ${vencimentoFormatado}` }
            ]
          });

          return acc;
        }, {});

        setProdutos(agrupados);
        setProdutosFiltrados(agrupados);
      } catch (err) {
        console.error('Erro ao buscar produtos:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProdutos();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-3">
        <h4>Erro ao carregar estoque</h4>
        <p>{error}</p>
        <Button variant="primary" onClick={() => window.location.reload()}>
          Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* <AlertaSobre
      title="sim"
      text="sim2"
      verificacao={true}/> */}
      <NavBar />
      <Container className="my-4">
        <h1 style={{ marginTop: "100px" }}><b>INSUMOS</b></h1>

        <Pesquisa
          nomeDrop="Filtrar por"
          navega="/cadastro_insumos"
          TxtButton="Insumos +"
          lista={[
            { texto: "Carnes", value: "Carnes" },
            { texto: "Perecíveis", value: "Perecíveis" },
            { texto: "Molhos", value: "Molhos" },
            { texto: "Congelados", value: "Congelados" }
          ]}
          onFilterChange={handleFiltroChange}
        />

        {Object.entries(produtosFiltrados)
          .sort(([keyA], [keyB]) => keyA.localeCompare(keyB, 'pt-BR')) // Sort by normalized key
          .map(([normalizedCategoryKey, categoryData]) => (
            <div key={normalizedCategoryKey} id={normalizedCategoryKey} className="mb-5">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>{categoryData.displayName}</h2> {/* Use the stored display name */}
              </div>

              <CardGeral
                card={[...categoryData.items].sort((a, b) =>
                  a.nome.localeCompare(b.nome, 'pt-BR')
                )}
                onCardClick={handleCardClick}
                imgHeight={250}
                showButtons={false}
                customButton={(item) => (
                  <>
                    <Button
                      variant="warning"
                      className="rounded-circle fs-5 text-center shadow m-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(item.id);
                      }}
                      title="Editar item"
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="danger"
                      className="rounded-circle fs-5 text-center shadow m-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.id);
                      }}
                      title="Excluir item"
                    >
                      <FaRegTrashAlt />
                    </Button>
                  </>
                )}
              />
            </div>
          ))}

        {Object.keys(produtosFiltrados).length === 0 && !loading && (
          <div className="text-center py-5">
            <h4>Nenhum item encontrado{filtroAtivo !== 'Todos' ? ` na categoria ${filtroAtivo}` : ' no estoque'}</h4>
            <Button
              variant="primary"
              onClick={() => navigate('/cadastro_insumos')}
              className="mt-3"
            >
              Adicionar Novo Item
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Estoque;