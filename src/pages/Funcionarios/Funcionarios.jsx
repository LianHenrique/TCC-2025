import { Button, Card } from 'react-bootstrap'
import NavBar from '../../components/NavBar/NavBar'
import Pesquisa from '../../components/Pesquisa/Pesquisa'
import { FaEdit, FaRegTrashAlt } from 'react-icons/fa'

const Funcionarios = () => {
  return (
    <div>
      <NavBar 
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

      <Pesquisa />
      <Card style={{ width: '18rem', margin: "10px", padding: "5px" }}>
        <Card.Img variant="top" src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png" />
        <Card.Body>
          <Card.Title>Nome</Card.Title>
          <Card.Text>
            Cargo: X
          </Card.Text>
          <Card.Text>
            Idade: XX
          </Card.Text>
          <Card.Text>
            Calendario
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
    </div>
  )
}

export default Funcionarios