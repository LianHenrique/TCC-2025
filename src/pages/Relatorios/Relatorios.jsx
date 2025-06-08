import React, { useEffect, useState } from 'react'
import NavBar from '../../components/NavBar/NavBar'
import styles from './Relatorios.module.css'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import CardGeral from '../../components/Cards/CardGeral';
import { Col, Container, Figure } from 'react-bootstrap';

const Relatorios = () => {
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
          { texto: `ID: ${func.id_funcionario}` }
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
      <Container
        className='d-flex flex-wrap'
        style={{
          marginTop: "90px"
        }}>
        <Col
          className='shadow rounded-5 m-2'
          style={{
            padding: "10px",
            maxWidth: "600px",
            minWidth: "300px"
          }}>
          <Figure>
            <h1
              style={{
                paddingLeft: "30px",
                paddingTop: "10px"
              }}>
              Mensal
            </h1>
            <Figure.Image
              style={{
                width: "100%"
              }}
              alt="Gráfico API"
              src="../src/public/Grafico.svg"
            />
            <Figure.Caption
              style={{
                paddingLeft: "30px"
              }}>
              1. Faturamento Estimado
              <br />
              Faturamento médio mensal: R$ 50.000,00
              <br />
              Faturamento durante a alta temporada (dezembro a fevereiro): Aumento de até 30%
              <br />
              Faturamento durante o Carnaval: Aumento de até 20%
              <br />
              Folha Vitória
              <br /><br />
              2. Custos Operacionais
              Custo médio de uma refeição por cliente: R$ 54,67
              <br />
              Custo médio de um almoço completo fora de casa: R$ 48,79
              Folha Vitória
              <br /><br />
              3. Mão de Obra
              Número de colaboradores: 7.603 profissionais contratados com carteira assinada no setor de restaurantes e similares em Vitória
              <br />
              Novas contratações previstas para o verão: 5.000 postos de trabalho
              <br /><br />
              4. Desempenho do Setor
              Expectativa de crescimento do faturamento no verão: Até 30%
              <br />
              Expectativa de aumento no faturamento durante o Carnaval: Até 20%
            </Figure.Caption>
          </Figure>
        </Col>
        <Col
          className='shadow rounded-5 m-2'
          style={{
            padding: "10px",
            maxWidth: "600px"
          }}>
          <Figure>
            <h1
              style={{
                paddingLeft: "30px",
                paddingTop: "10px"
              }}>
              Diario
            </h1>
            <Figure.Image
              style={{
                width: "100%"
              }}
              alt="Gráfico API"
              src="../src/public/Grafico.svg"
            />
            <Figure.Caption
              style={{
                paddingLeft: "30px"
              }}>
              1. Faturamento Estimado
              <br />
              Ticket médio por cliente: R$ 54,67
              <br />
              Número de clientes atendidos: 50 clientes
              <br />
              Faturamento diário estimado: R$ 2.733,50
              <br /><br />
              2. Custos Operacionais
              <br />
              Custo médio de uma refeição por cliente: R$ 48,79
              <br />
              Custo operacional diário estimado: R$ 2.439,50
              <br /><br />
              3. Lucro Bruto Estimado
              <br />
              Lucro bruto diário estimado: R$ 294,00
            </Figure.Caption>
          </Figure>
        </Col>
      </Container>
    </div>
  )
}

export default Relatorios