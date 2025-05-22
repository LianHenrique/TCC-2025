import { Container } from 'react-bootstrap'
import NavBar from '../../components/NavBar/NavBar'
import Pesquisa from '../../components/Pesquisa/Pesquisa'
import CardGeral from '../../components/Cards/CardGeral'
import { useEffect, useState } from 'react'

const Funcionarios = () => {

  const [funcionarios, setFuncionarios] = useState([])

  const fetchFuncionarios = async () => {
    try {

      // Aqui eu tive que definir os ids, pq agente não sabe como exatamente que o funcionário vai estar presente no relatório.
      const IDfuncionario = [1, 2, 3, 4];

      const responsePromises = IDfuncionario.map(id =>
        fetch(`http://localhost:3000/funcionarios/${id}`)
          .then((response) => response.json())
          .catch((error) => {
            console.error('Erro ao buscar funcionário:', error);
          })
      );

      // Vai esperar tudo ser puxado para rodar
      const funcionariosData = await Promise.all(responsePromises)

      // formatando os dados. (opcional)
      const funcionariosFormatados = funcionariosData.map(func => ({
        nome: func.nome_funcionairo, //sim, o pedro digitou errado no banco
        link: func.imagem_url || 'https://img.freepik.com/fotos-premium/hamburguer-bonito-em-fundo-escuro_213607-15.jpg',
        descricao: [
          { texto: `Cargo: ${func.cargo_funcionario}` },
          { texto: `Email: : ${func.email_funcionario}` },
        ]
      }))

      setFuncionarios(funcionariosFormatados);
    } catch (error) {
      console.error('Erro ao buscar dados dos funcionários:', error)
    }
  }

  useEffect(() => {
    if (funcionarios.length === 0) {
      fetchFuncionarios();
    }
  }, []);

  return (
    <div>
      <NavBar />

      <Container>
        {/* <Pesquisa
          nomeDrop="Cargo"
          lista={[
            {
              texto: "ADM",
              link: "#ADM"
            },
            {
              texto: "Gerente",
              link: "#gerente"
            },
            {
              texto: "Funcionario",
              link: "#funcionario"
            }
          ]}
        /> */}
        <CardGeral
          filtro="Funcionarios"
          card={funcionarios}
        />
      </Container>
    </div>
  )
}

export default Funcionarios