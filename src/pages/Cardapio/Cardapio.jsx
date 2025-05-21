import { Button, Card, Container } from 'react-bootstrap'
import NavBar from '../../components/NavBar/NavBar'
import Pesquisa from '../../components/Pesquisa/Pesquisa'
import { FaEdit, FaRegTrashAlt } from 'react-icons/fa'

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
        <h2>Lanche</h2>
        <Card 
        className='shadow'  
        style={{ 
          width: '12rem',
          border: "none", 
          margin: "6px", 
          padding: "5px" 
        }}>
          <Card.Img 
          style={{
            borderRadius: "10px"
          }} variant="top" 
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4OUjn82f2jxBgIoqr_IG-12b6iYr1KzYr6TOedVsbCFAL5XajogQa5B0FcNVf4cS5nXs&usqp=CAU" />
            <Card.Body>
              <Card.Title>Hamburguer</Card.Title>
              <Button
                variant="warning"
                className="rounded-circle fs-5 text-center shadow m-1">
                <FaEdit />
              </Button>
              <Button
                variant="danger"
                className="rounded-circle fs-5 text-center shadow">
                <FaRegTrashAlt />
              </Button>
            </Card.Body>
          </Card>
        </Container>
    </div>
  )
}

export default Cardapio