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

  // Normaliza texto para comparações
  const normalizeString = (str) => {
    if (!str) return '';
    return String(str).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  };

  // Busca e formatação inicial do cardápio
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

          if (Array.isArray(item.insumos)) {
            insumosArray = item.insumos;
          } else if (
            typeof item.insumos === 'object' &&
            item.insumos !== null &&
            Object.keys(item.insumos).length > 0
          ) {
            insumosArray = [item.insumos];
          } else if (typeof item.insumos === 'string') {
            try {
              const parsed = JSON.parse(item.insumos);
              insumosArray = Array.isArray(parsed) ? parsed : [parsed];
            } catch {
              insumosArray = [];
            }
          }

          const ingredientesTexto =
            insumosArray.length > 0 && insumosArray.some(i => i.nome_insumo)
              ? `Ingredientes: ${insumosArray
                .map(insumo => insumo.nome_insumo)
                .filter(nome => !!nome)
                .join(', ')}`
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

  // Filtra o cardápio toda vez que cardapio, filtro ou texto mudam
  useEffect(() => {
    let filtered = [...cardapio];

    if (filtroSelecionado && filtroSelecionado !== 'Todos') {
      const filtroNorm = normalizeString(filtroSelecionado);
      filtered = filtered.filter(item => normalizeString(item.categoria) === filtroNorm);
    }

    if (textoBusca && textoBusca.trim() !== '') {
      const textoBuscaNorm = normalizeString(textoBusca);

      filtered = filtered.filter(item =>
        normalizeString(item.nome).includes(textoBuscaNorm) ||
        item.descricao.some(d => normalizeString(d.texto).includes(textoBuscaNorm))
      );
    }

    setCardapioFiltrado(filtered);
  }, [cardapio, filtroSelecionado, textoBusca]);

  // Atualiza estados de filtro e texto a partir do componente Pesquisa
  const handleFilterChange = (filtro) => {
    setFiltroSelecionado(filtro);
  };

  const handleSearchChange = (texto) => {
    setTextoBusca(texto);
  };

  function handleCardClick(id) {
    navigate(`/Visualizar_Cardapio/${id}`);
  }

  function handleDelete(id) {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      fetch(`http://localhost:3000/cardapio/${id}`, {
        method: 'DELETE'
      })
        .then(response => {
          if (response.ok) {
            setCardapio(prev => prev.filter(item => item.id !== id));
          } else {
            alert('Erro ao excluir produto');
          }
        })
        .catch(err => console.error('Erro ao excluir:', err));
    }
  }

  function handlePedir(id_cardapio) {
    fetch('http://localhost:3000/saida-venda', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_cardapio })
    })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) {
          const msg = data.error || 'Erro desconhecido';
          throw new Error(msg);
        }
        return data;
      })
      .then(data => {
        alert(data.message || 'Pedido registrado com sucesso!');
      })
      .catch(error => {
        console.error('Erro ao registrar pedido:', error.message);
        alert(`Não foi possível concluir o pedido:\n\n${error.message}`);
      });
  }

  return (
    <div>
      <NavBar />
      <Container>
        <h1 style={{ marginTop: "100px" }}><b>PRODUTOS</b></h1>
        <Pesquisa
          nomeDrop="Filtro"
          navega="/cadastro_produto"
          TxtButton="Produtos +"
          lista={[
            { value: 'Lanche', texto: 'Lanche' },
            { value: 'Bebida', texto: 'Bebida' },
            { value: 'Sobremesa', texto: 'Sobremesa' }
          ]}
          onFilterChange={handleFilterChange}
          onSearchChange={handleSearchChange} // **PASSA O onSearchChange**
        />

        <CardGeral
          card={cardapioFiltrado}
          onCardClick={handleCardClick}
          showButtons={false}
          imgHeight={250}
          customButton={item => (
            <Button
              variant="success"
              style={{ padding: "15px" }}
              className="fs-5 text-center shadow alert-success align-center bg-success text-white"
              onClick={() => handlePedir(item.id)}
            >
              Pedir
            </Button>
          )}
        />
      </Container>
    </div>
  );
};

export default Cardapio;