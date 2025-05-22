import { Button, Card, Container } from 'react-bootstrap'
import NavBar from '../../components/NavBar/NavBar'
import Pesquisa from '../../components/Pesquisa/Pesquisa'
import { FaEdit, FaRegTrashAlt } from 'react-icons/fa'
import CardGeral from '../../components/Cards/CardGeral'

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
      <CardGeral 
        filtro="Gerente"
        card={[
          {
            nome:"Nome",
            link:"https://cdn-icons-png.flaticon.com/512/1077/1077114.png",
            descricao:[
              {
                texto:"Cargo: X",
              },
              {
                texto:"Salario: R$ XXXX,XX",
              },
            ]
          }
        ]}
        />
      </Container>
    </div>
  )
}

export default Funcionarios