import { Button, Card, Container } from 'react-bootstrap'
import NavBar from '../../components/NavBar/NavBar'
import Pesquisa from '../../components/Pesquisa/Pesquisa'
import { FaEdit, FaRegTrashAlt } from 'react-icons/fa'

const Funcionarios = () => {
  return (
    <div>
      <NavBar />

      <Container>
      <Pesquisa 
      nomeDrop="Cargo" 
      lista={[
        {
          lista: "Gerente",
          link: "#gerente"  
        },
        {
          lista: "Estoquista",
          link: "#estoquista"  
        }
      ]}
      />
      <h2>Gerente</h2>
      <Card className='shadow'  style={{ width: '12rem', border: "none", margin: "6px", padding: "5px" }}>
        <Card.Img variant="top" src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png" />
          <Card.Body>
            <Card.Title>Nome</Card.Title>
            <Card.Text>
              Cargo: X
            </Card.Text>
            <Card.Text>
              Salario
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

export default Funcionarios