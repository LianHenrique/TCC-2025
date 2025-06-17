import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import NavBar from '../../components/NavBar/NavBar';
import Pesquisa from '../../components/Pesquisa/Pesquisa';
import { Button, Container, Badge } from 'react-bootstrap';
import CardGeral from '../../components/Cards/CardGeral';
import { FaEdit, FaRegTrashAlt } from 'react-icons/fa';

const Estoque = () => {
  const [produtos, setProdutos] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Definindo todas as funções no início do componente
  const handleCardClick = (id) => {
    navigate(`/visualizar/${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deseja realmente deletar este item do estoque?')) return;

    try {
      const response = await fetch(`http://localhost:3000/estoqueDeletarItem/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar o item');
      }

      const data = await response.json();
      console.log("Item deletado com sucesso", data);
      
      setProdutos(prev => {
        const newProdutos = {...prev};
        for (const categoria in newProdutos) {
          newProdutos[categoria] = newProdutos[categoria].filter(p => p.id !== id);
          if (newProdutos[categoria].length === 0) {
            delete newProdutos[categoria];
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
          const cat = insumo.categoria?.trim() || 'Outros';
          
          if (!acc[cat]) {
            acc[cat] = [];
          }

          const entradaFormatada = insumo.data_entrada_insumos
            ? new Date(insumo.data_entrada_insumos).toLocaleDateString('pt-BR')
            : 'Data desconhecida';

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

          acc[cat].push({
            id: insumo.id_insumos,
            nome: insumo.nome_insumos,
            dataEntrada: entradaFormatada,
            dataVencimento: vencimentoFormatado,
            quantidade: insumo.quantidade_insumos,
            unidade: insumo.unidade_medida,
            valor: valorNumerico,
            statusEstoque,
            link: insumo.imagem_url || 'https://cdn.melhoreshospedagem.com/wp/wp-content/uploads/2023/07/erro-404.jpg',
            descricao: [
              { 
                texto: `Quantidade: ${insumo.quantidade_insumos} ${insumo.unidade_medida}`,
                badge: statusEstoque
              },
              { texto: `Valor unitário: ${valorFormatado}` },
              { texto: `Entrada: ${entradaFormatada}` },
              { texto: `Vencimento: ${vencimentoFormatado}` }
            ]
          });

          return acc;
        }, {});

        setProdutos(agrupados);
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
      <NavBar />
      <Container className="my-4">
        <h1 style={{ marginTop: "100px" }}>Estoque</h1>
        
        <Pesquisa
          nomeDrop="Filtrar por"
          navega="/cadastro_insumos"
          textoBotao="Adicionar Insumo"
          lista={[
            { texto: "Todos", link: "#" },
            { texto: "Carnes", link: "#carnes" },
            { texto: "Perecíveis", link: "#pereciveis" },
            { texto: "Molhos", link: "#molhos" },
            { texto: "Congelados", link: "#congelados" },
            { texto: "Outros", link: "#outros" }
          ]}
        />

        {Object.entries(produtos)
          .sort(([catA], [catB]) => catA.localeCompare(catB, 'pt-BR'))
          .map(([categoria, produtosDaCategoria]) => (
            <div key={categoria} id={categoria.toLowerCase()} className="mb-5">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>{categoria}</h2> 
              </div>
              
              <CardGeral
                card={[...produtosDaCategoria].sort((a, b) =>
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
          
        {Object.keys(produtos).length === 0 && !loading && (
          <div className="text-center py-5">
            <h4>Nenhum item encontrado no estoque</h4>
            <Button 
              variant="primary" 
              onClick={() => navigate('/cadastro_insumos')}
              className="mt-3"
            >
              Adicionar Primeiro Item
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Estoque;