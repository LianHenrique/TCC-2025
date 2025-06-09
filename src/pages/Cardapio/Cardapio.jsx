import { Container } from 'react-bootstrap';
import NavBar from '../../components/NavBar/NavBar';
import Pesquisa from '../../components/Pesquisa/Pesquisa';
import { FaEdit, FaRegTrashAlt } from 'react-icons/fa';
import CardGeral from '../../components/Cards/CardGeral';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from 'react-bootstrap';

const Cardapio = () => {
  const [cardapio, setCardapio] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3000/cardapio')
      .then(resposta => resposta.json())
      .then(data => {
        if (!Array.isArray(data)) {
          console.error('Dados retornados não são um array:', data);
          return;
        }

        const cardapioFormatado = data.map(item => {
          let componentes = [];

          try {
            const insumosArray =
              typeof item.insumos === 'string'
                ? JSON.parse(item.insumos)
                : item.insumos;

            componentes =
              Array.isArray(insumosArray) && insumosArray.length > 0
                ? insumosArray.map(insumo => ({
                    texto: `• ${insumo.nome_insumo} - ${insumo.quantidade} ${insumo.unidade_medida || ''}`
                  }))
                : [{ texto: 'Componentes: Não informado' }];
          } catch (e) {
            componentes = [{ texto: 'Componentes: Não informado' }];
          }

          return {
            id: item.id_cardapio,
            nome: item.nome_item || 'Produto sem nome',
            link: item.imagem_url || 'https://cdn.melhoreshospedagem.com/wp/wp-content/uploads/2023/07/erro-404.jpg',
            descricao: [
              { texto: `Descrição: ${item.descricao_item || 'Sem descrição'}` },
              ...componentes,
              { texto: `Preço: R$ ${Number(item.valor_item || 0).toFixed(2)}` },
              { texto: `Categoria: ${item.categoria || 'Não informada'}` }
            ],
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

  function handlePedir(id_cardapio) {
    fetch('http://localhost:3000/saida-venda', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id_cardapio })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert('Erro ao registrar pedido: ' + data.error);
        } else {
          alert('Pedido registrado com sucesso!');
        }
      })
      .catch(error => {
        console.error('Erro ao registrar pedido:', error);
        alert('Erro na comunicação com o servidor');
      });
  }

  return (
    <div>
      <NavBar />
      <Container>
        <Pesquisa
          nomeDrop="Filtro"
          navega="/cadastro_produto"
          lista={[
            { lista: 'Lanche', link: '#lanche' },
            { lista: 'Bebida', link: '#bebida' },
            { lista: 'Sobremesa', link: '#sobremesa' }
          ]}
        />

        <CardGeral
          filtro=""
          card={cardapio}
          onCardClick={handleCardClick}
          showButtons={false}
          customButton={item => (
            <Button
              variant="success"
              className="h-10 fs-5 text-center shadow alert-success align-center bg-success text-white"
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
