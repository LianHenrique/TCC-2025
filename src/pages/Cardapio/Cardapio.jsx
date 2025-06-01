import { Container } from 'react-bootstrap';
import NavBar from '../../components/NavBar/NavBar';
import Pesquisa from '../../components/Pesquisa/Pesquisa';
import { FaEdit, FaRegTrashAlt } from 'react-icons/fa';
import CardGeral from '../../components/Cards/CardGeral';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

const Cardapio = () => {
  const [cardapio, setCardapio] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3000/cardapio')
      .then(resposta => resposta.json())
      .then(data => {
        const cardapioFormatado = data.map(item => ({
          id: item.id_item,
          nome: item.nome_c_produto || 'Produto sem nome',
          link: item.link_prod_cardapio || 'https://via.placeholder.com/150',
          descricao: [
            { texto: `Descrição: ${item.descricao_item}` },
            { texto: `Componentes: ${item.descri_prod_insumos || 'Não informado'}` },
            { texto: `Preço: R$ ${Number(item.valor_item).toFixed(2)}` }
          ],
          acoes: [
            {
              icone: <FaEdit />,
              onClick: () => navigate(`/editar_produto/${item.id_item}`)
            },
            {
              icone: <FaRegTrashAlt />,
              onClick: () => handleDelete(item.id_item)
            }
          ]
        }));
        setCardapio(cardapioFormatado);
      })
      .catch(error => console.error('Erro ao buscar cardápio:', error));
  }, []);

  function handleCardClick(id) {
    navigate(`/visualizar/${id}`);
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

  return (
    <div>
      <NavBar />
      <Container>
        <Pesquisa
          nomeDrop="Filtro"
          navega="/cadastro_produto"
          lista={[
            { lista: "Lanche", link: "#lanche" },
            { lista: "Bebida", link: "#bebida" },
            { lista: "Sobremesa", link: "#sobremesa" }
          ]}
        />

        <CardGeral
          filtro=""
          card={cardapio}
          onCardClick={handleCardClick}
        />
      </Container>
    </div>
  );
};

export default Cardapio;