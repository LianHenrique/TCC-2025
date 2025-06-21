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
  const navigate = useNavigate();

  const normalizeString = (str) =>
    str ? String(str).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim() : '';

  useEffect(() => {
    fetch(`http://localhost:3000/cardapio`)
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) {
          console.error('Dados retornados não são um array:', data);
          return;
        }

        const cardapioFormatado = data.map(item => {
          let insumosArray = [];

          try {
            if (Array.isArray(item.insumos)) {
              insumosArray = item.insumos;
            } else if (typeof item.insumos === 'string') {
              const parsed = JSON.parse(item.insumos);
              insumosArray = Array.isArray(parsed) ? parsed : [parsed];
            }
          } catch {
            insumosArray = [];
          }

          const parseNumero = (valor) => {
            if (typeof valor === 'number') return valor;
            if (typeof valor === 'string') {
              return parseFloat(valor.replace(/\./g, '').replace(',', '.'));
            }
            return 0;
          };

          const estoqueInsuficiente = insumosArray.some(insumo => {
            const disponivel = parseNumero(insumo.quantidade_insumos);
            const necessario = parseNumero(insumo.quantidade_necessaria);
            return !isFinite(disponivel) || !isFinite(necessario) || disponivel < necessario;
          });

          const ingredientesTexto = insumosArray.length
            ? `Ingredientes: ${insumosArray.map(i => i?.nome_insumo || 'Desconhecido').join(', ')}`
            : 'Ingredientes: Não informado';

          return {
            id: item.id_cardapio,
            nome: item.nome_item || 'Produto sem nome',
            link:
              item.imagem_url ||
              'https://cdn.melhoreshospedagem.com/wp/wp-content/uploads/2023/07/erro-404.jpg',
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
      })
      .catch(error => console.error('Erro ao buscar cardápio:', error));
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

  const handlePedir = (id_cardapio) => {
    fetch('http://localhost:3000/saida-venda', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_cardapio })
    })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || 'Erro desconhecido');
        alert(data.message || 'Pedido registrado com sucesso!');
      })
      .catch(error => {
        console.error('Erro ao registrar pedido:', error.message);
        alert(`Não foi possível concluir o pedido:\n\n${error.message}`);
      });
  };

  return (
    <div>
      <NavBar />
      <Container style={{ marginTop: '100px' }}>
        <h1 className="fw-bold mb-2">PRODUTOS</h1>

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
          card={cardapioFiltrado}
          onCardClick={id => navigate(`/Visualizar_Cardapio/${id}`)}
          showButtons={false}
          customButton={item =>
            item.estoqueInsuficiente ? (
              <div
                className="d-flex flex-column align-items-center justify-content-center"
                style={{
                  marginTop: '20px',
                }}
              >
                <div
                  style={{
                    backgroundColor: '#e74c3c',
                    color: '#fff',
                    fontWeight: 'bold',
                    padding: '10px 20px',
                    borderRadius: '30px',
                    marginBottom: '10px',
                    fontSize: '1rem',
                    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  Estoque insuficiente
                </div>
                <Button
                  variant="outline-danger"
                  className="rounded-pill px-4 py-2"
                  style={{ fontWeight: 'bold' }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigate('/estoque');
                  }}
                >
                  Ver Estoque
                </Button>
              </div>
            ) : (
              <div className="d-flex justify-content-center mt-3">
                <Button
                  variant="success"
                  className="rounded-pill shadow-sm text-white px-4 py-2"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handlePedir(item.id);
                  }}
                >
                  Pedir
                </Button>
              </div>
            )
          }
        />
      </Container>
    </div>
  );
};

export default Cardapio;