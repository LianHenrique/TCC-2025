import { FaEdit, FaRegTrashAlt } from 'react-icons/fa'
import NavBar from '../../components/NavBar/NavBar'
import Pesquisa from '../../components/Pesquisa/Pesquisa'
import { Button, Card } from 'react-bootstrap'

const Estoque = () => {
  return (
    <div>
      <NavBar />
      <Pesquisa />
      <Card style={{ width: '18rem', margin: "10px", padding: "5px" }}>
        <Card.Img variant="top" src="https://organic4.com.br/wp-content/uploads/2023/04/img-site-1-lanches-burger-carne.jpg" />
        <Card.Body>
          <Card.Title>Hamburguer</Card.Title>
          <Card.Text>
            Carne de lanche comum
          </Card.Text>
          <Card.Text>
            Data de entrada: XX/XX/XXXX
          </Card.Text>
          <Card.Text>
            Quantidade: XX
          </Card.Text>
          <Card.Text>
            R$ XX
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
    </div>
  )
}

export default Estoque