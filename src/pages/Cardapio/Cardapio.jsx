import { Container } from 'react-bootstrap'
import NavBar from '../../components/NavBar/NavBar'
import Pesquisa from '../../components/Pesquisa/Pesquisa'
import { FaEdit, FaRegTrashAlt } from 'react-icons/fa'
import CardGeral from '../../components/Cards/CardGeral'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

const Cardapio = () => {
  const [cardapio, setCardapio] = useState([])
  const navigate = useNavigate()


  // useEffect p/fazer uma vez
  useEffect(() => {
    fetch('http://localhost:3000/cardapio')
      .then(resposta => resposta.json())
      .then(data => {
        const cardapioFormatado = data.map(item => ({
          nome: item.nome_c_produto || 'Sem nome',
          link: item.link_prod_cardapio || 'https://via.placeholder.com/150',
          descricao: [
            { texto: `Item: ${item.nome_c_produto}` },
            { texto: `Componentes: ${item.descri_prod_insumos}` }
          ],
        }))
        setCardapio(cardapioFormatado)
      })
      .catch(error => console.error('Erro ao buscar cardápio:', error))
  }, [])

  function handleCardClick(id) {
    navigate(`/visualizar/${id}`)
  }

  return (
    <div>
      <NavBar />
      <Container>

        <Pesquisa
          nomeDrop="Filtro"
          navega="/cadastro_produto"
          lista={[
            {
              lista: "Lanche",
              link: "#lanche"
            },
            {
              lista: "Bebida",
              link: "#bebida"
            },
            {
              lista: "Sobremesa",
              link: "#bebida"
            }
          ]}
        />

        <CardGeral
          filtro="cardapio"
          card={cardapio}
          onCardClick={handleCardClick}
        />
      </Container>
    </div>
  )
}

export default Cardapio