import { FaEdit, FaRegTrashAlt } from 'react-icons/fa'
import NavBar from '../../components/NavBar/NavBar'
import Pesquisa from '../../components/Pesquisa/Pesquisa'
import { Button, Card, Container } from 'react-bootstrap'
import CardGeral from '../../components/Cards/CardGeral'

const Estoque = () => {
  return (
    <div>
      <NavBar />
      <Container>
        <Pesquisa 
        nomeDrop="Filtro" 
        lista={[
          {
            lista: "Carnes",
            link: "#carnes"  
          },
          {
            lista: "Bebidas",
            link: "#bebidas"  
          },
          {
            lista: "Saladas",
            link: "#saladas"  
          },
        ]}
        />
        <CardGeral 
        filtro="Carnes"
        card={[
          {
            nome:"Hamburguer",
            link:"https://organic4.com.br/wp-content/uploads/2023/04/img-site-1-lanches-burger-carne.jpg",
            descricao:[
              {
                texto:"Data de entrada: XX/XX/XXXX"
              },
              {
                texto:"Quantidade: XX"
              },
            ]
          },
        ]}
        />
      </Container>
    </div>
  )
}

export default Estoque