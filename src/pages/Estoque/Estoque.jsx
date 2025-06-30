import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import NavBar from '../../components/NavBar/NavBar';
import Pesquisa from '../../components/Pesquisa/Pesquisa';
import { Button, Container } from 'react-bootstrap';
import CardGeral from '../../components/Cards/CardGeral';
import { FaEdit, FaRegTrashAlt } from 'react-icons/fa';
import { AuthContext } from '../../Contexts/UserContext';

const Estoque = () => {
  const [produtos, setProdutos] = useState({});
  const [produtosFiltrados, setProdutosFiltrados] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroAtivo, setFiltroAtivo] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { cargoUsuario, isloading } = useContext(AuthContext);

  const isFuncionario = cargoUsuario === 'Funcionario';

  if (isloading) return <p>Espere...</p>;

  const normalizeString = (str) => {
    if (!str) return '';
    return String(str).normalize('NFD').replace(/\u0300-\u036f/g, '').toLowerCase().trim();
  };

  const filtrarProdutos = (categoria, texto) => {
    const filtroNormalizado = categoria && categoria !== 'Todos' ? normalizeString(categoria) : null;
    const textoNormalizado = normalizeString(texto);
    const filtrados = {};

    for (const catKey in produtos) {
      if (filtroNormalizado && catKey !== filtroNormalizado) continue;

      const itensFiltrados = produtos[catKey].items.filter(item =>
        item.nome.toLowerCase().includes(textoNormalizado)
      );

      if (itensFiltrados.length > 0) {
        filtrados[catKey] = {
          displayName: produtos[catKey].displayName,
          items: itensFiltrados
        };
      }
    }

    setProdutosFiltrados(filtrados);
  };

  useEffect(() => {
    filtrarProdutos(filtroAtivo, searchTerm);
  }, [filtroAtivo, searchTerm, produtos]);

  const handleFiltroChange = (filtroSelecionado) => setFiltroAtivo(filtroSelecionado);
  const handleSearchChange = (texto) => setSearchTerm(texto);

  const handleCardClick = (id) => {
    if (!isFuncionario) navigate(`/visualizar/${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deseja realmente deletar este item do estoque?')) return;

    try {
      const response = await fetch(`http://localhost:3000/insumos/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Erro ao deletar item');

      const data = await response.json();
      alert(data.message || 'Insumo desativado com sucesso');

      setProdutos(prev => {
        const novoEstado = { ...prev };
        for (const categoriaKey in novoEstado) {
          novoEstado[categoriaKey].items = novoEstado[categoriaKey].items.filter(p => p.id !== id);
          if (novoEstado[categoriaKey].items.length === 0) delete novoEstado[categoriaKey];
        }
        setProdutosFiltrados(novoEstado);
        return novoEstado;
      });

    } catch (err) {
      console.error('Erro:', err);
      alert('Erro ao deletar item: ' + err.message);
    }
  };

  const handleEdit = (id) => navigate(`/editar/${id}`);

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const res = await fetch('http://localhost:3000/estoque');
        if (!res.ok) throw new Error(`Erro HTTP: ${res.status}`);

        const data = await res.json();
        if (!Array.isArray(data)) throw new Error('Formato de dados inv\u00e1lido da API');

        const agrupados = data.reduce((acc, insumo) => {
          const categoria = insumo.categoria || 'Outros';
          const key = normalizeString(categoria);
          if (!acc[key]) acc[key] = { displayName: categoria, items: [] };

          const venc = insumo.data_vencimento ? new Date(insumo.data_vencimento) : null;
          const hoje = new Date();
          const diasRestantes = venc ? Math.ceil((venc - hoje) / (1000 * 60 * 60 * 24)) : null;
          const vencProximo = diasRestantes !== null && diasRestantes <= insumo.alertar_dias_antes && diasRestantes >= 0;
          const vencimentoFormatado = venc ? venc.toLocaleDateString('pt-BR') : 'Sem data';
          const valor = parseFloat(insumo.valor_insumos) || 0;
          const valorFormatado = isNaN(valor) ? 'Valor inv\u00e1lido' : `R$ ${valor.toFixed(2)}`;
          const statusEstoque =
            insumo.quantidade_insumos <= insumo.alerta_estoque ? 'danger' :
              insumo.quantidade_insumos <= insumo.alerta_estoque + 5 ? 'warning' : 'success';

          const descricao = isFuncionario
            ? [
              { texto: `Descri\u00e7\u00e3o: ${insumo.descricao_insumos}` }
            ]
            : [
              {
                texto: `Quantidade: ${insumo.quantidade_insumos}${insumo.unidade_medida ? ' ' + insumo.unidade_medida : ''}`,
                style: insumo.quantidade_insumos <= insumo.alerta_estoque ? { color: 'red', fontWeight: 'bold' } : {}
              },
              { texto: `Valor unit\u00e1rio: ${valorFormatado}` },
              {
                texto: `Vencimento: ${vencimentoFormatado}`,
                badge: vencProximo ? 'danger' : undefined,
                tooltip: vencProximo ? `Este produto vence em at\u00e9 ${insumo.alertar_dias_antes} dias` : undefined
              }
            ];

          acc[key].items.push({
            id: insumo.id_insumos,
            nome: insumo.nome_insumos,
            quantidade: insumo.quantidade_insumos,
            unidade: insumo.unidade_medida,
            valor,
            statusEstoque,
            dataVencimento: vencimentoFormatado,
            link: insumo.imagem_url
              ? (insumo.imagem_url.startsWith('http')
                ? insumo.imagem_url
                : `http://localhost:3000${insumo.imagem_url}`)
              : 'https://cdn.melhoreshospedagem.com.br/wp/wp-content/uploads/2023/07/erro-404.jpg',
            descricao
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
      <NavBar />
      <Container className="my-4">
        <h1 style={{ marginTop: '100px' }}><b>INSUMOS</b></h1>

        <Pesquisa
          nomeDrop="Filtrar por"
          navega={!isFuncionario ? "/cadastro_insumos" : null}
          TxtButton={!isFuncionario ? "Insumos +" : null}
          lista={[
            { texto: 'Carnes', value: 'Carnes' },
            { texto: 'Perec\u00edveis', value: 'Perec\u00edveis' },
            { texto: 'Molhos', value: 'Molhos' },
            { texto: 'Congelados', value: 'Congelados' }
          ]}
          onFilterChange={handleFiltroChange}
          onSearchChange={handleSearchChange}
        />

        {Object.entries(produtosFiltrados).sort(([a], [b]) => a.localeCompare(b, 'pt-BR')).map(([key, data]) => (
          <div key={key} className="mb-5">
            <h2>{data.displayName}</h2>

            <CardGeral
              card={data.items.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))}
              onCardClick={handleCardClick}
              imgHeight={250}
              showButtons={false}
              customButton={(item) => (
                !isFuncionario && (
                  <>
                    <Button
                      variant="warning"
                      className="rounded-circle fs-5 shadow m-1"
                      onClick={(e) => { e.stopPropagation(); handleEdit(item.id); }}
                      title="Editar item"
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="danger"
                      className="rounded-circle fs-5 shadow m-1"
                      onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                      title="Excluir item"
                    >
                      <FaRegTrashAlt />
                    </Button>
                  </>
                )
              )}
            />
          </div>
        ))}

        {Object.keys(produtosFiltrados).length === 0 && (
          <div className="text-center py-5">
            <h4>
              Nenhum item encontrado
              {filtroAtivo !== 'Todos' ? ` na categoria ${filtroAtivo}` : ' no estoque'}
            </h4>
            {!isFuncionario && (
              <Button variant="primary" onClick={() => navigate('/cadastro_insumos')} className="mt-3">
                Adicionar Novo Item
              </Button>
            )}
          </div>
        )}
      </Container>
    </div>
  );
};

export default Estoque;
