import { Button, Card, Container } from 'react-bootstrap'
import NavBar from '../../components/NavBar/NavBar'
import Pesquisa from '../../components/Pesquisa/Pesquisa'
import { FaEdit, FaRegTrashAlt } from 'react-icons/fa'
import CardGeral from '../../components/Cards/CardGeral' 

const Cardapio = () => { 
  return (
    <div>
        <NavBar />
        <Container>

        <Pesquisa 
        nomeDrop="Filtro" 
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
        filtro=""
        card={[
          {
            nome:"",
            link:"",
            descricao:[
              {
                texto:"",
              }
            ]
          }
        ]}
        />
        </Container>
    </div>
  )
}

export default Cardapio