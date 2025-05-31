import { Button, Card, Container } from 'react-bootstrap'
import NavBar from '../../components/NavBar/NavBar'
import Pesquisa from '../../components/Pesquisa/Pesquisa'
import { FaEdit, FaRegTrashAlt } from 'react-icons/fa'
import CardGeral from '../../components/Cards/CardGeral'
import { useNavigate } from 'react-router'
import { useEffect } from 'react'
import { useState } from 'react'

const Funcionarios = () => {
  const [funcionario, setFuncionario] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetch('http://localhost:3000/funcionarios')
      .then(resposta => resposta.json())
      .then(data => {
        const FuncionariosFormatados = data.map(func => ({
          id: func.id_funcionario,
          nome: func.nome_funcionairo,
          link: func.link || 'https://via.placeholder.com/150',
          descricao: [
            { texto: `Email: ${func.email_funcionario}`}
          ],
        }))
        setFuncionario(FuncionariosFormatados)
      })
      .catch(error => console.error('Erro ao buscar funcionário', error))
  }, [])

  function handleCardClick(id){
    navigate(`/visualizar_funcionario/${id}`)
  }

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
      {/* <CardGeral 
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
        /> */}

        <CardGeral
          filtro=""
          card={funcionario}
          onCardClick={handleCardClick}
        />

      </Container>
    </div>
  )
}

export default Funcionarios