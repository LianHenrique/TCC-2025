import { FaEdit, FaRegTrashAlt } from 'react-icons/fa'
import NavBar from '../../components/NavBar/NavBar'
import Pesquisa from '../../components/Pesquisa/Pesquisa'
import { Button, Card, Container } from 'react-bootstrap'

const Estoque = () => {
  return (
    <div>
      <NavBar />
      <Container>
        <Pesquisa 
        nomeDrop="Filtro" 
        lista={[
          {
            lista: "Carne",
            link: "#carne"  
          },
          {
            lista: "Bebida",
            link: "#bebida"  
          },
          {
            lista: "Salada",
            link: "#salada"  
          },
        ]}
        />
        <h2>Carne</h2>
        <Card className='shadow'  style={{ width: '12rem', border: "none", margin: "6px", padding: "5px" }}>
          <Card.Img style={{borderRadius: "10px"}} variant="top" src="https://organic4.com.br/wp-content/uploads/2023/04/img-site-1-lanches-burger-carne.jpg" />
          <Card.Body>
            <Card.Title>Hamburguer</Card.Title>
            <Card.Text>
              Data de entrada: XX/XX/XXXX
            </Card.Text>
            <Card.Text>
              Quantidade: XX
            </Card.Text>
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

export default Estoque