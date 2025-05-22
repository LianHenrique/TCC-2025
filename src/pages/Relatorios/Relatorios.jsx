import React, { useEffect, useState } from 'react'
import NavBar from '../../components/NavBar/NavBar'
import styles from './Relatorios.module.css'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import CardGeral from '../../components/Cards/CardGeral';

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
      <section style={{ paddingBottom: '8rem' }}>
        <NavBar />
      </section>

      {/* Parte da descrição do relatório */}
      <section className={styles.EscopoRelatorio}>
        <img src="../src/public/Grafico.svg" className={styles.img} alt="Gráfico API" />
        <h4 className="fs-6 fs-md-5 fs-lg-4">Descrição do relatório de ganhos semanais (15 a 21 de abril de 2025)</h4>

        <p className="fs-6 fs-md-5 fs-lg-4">Durante a semana de 15 a 21 de abril de 2025, a hamburgueria apresentou variação nos ganhos diários. Na segunda-feira (15/04), os ganhos foram de R$800, subindo levemente na terça-feira (16/04) para R$950. Na quarta-feira (17/04), houve um aumento significativo, chegando a R$1.200. Quinta-feira (18/04) registrou um pequeno recuo para R$1.100.</p>

        <p className="fs-6 fs-md-5 fs-lg-4">O maior volume de vendas foi observado no fim de semana. Na sexta-feira (19/04), os ganhos saltaram para R$2.300, seguidos por um pico no sábado (20/04) com R$2.800, o dia mais lucrativo da semana. No domingo (21/04), os ganhos fecharam em R$2.000, mantendo o alto desempenho do fim de semana.</p>

        <p className="fs-6 fs-md-5 fs-lg-4">Esses dados mostram claramente o padrão de maior movimento nos últimos dias da semana, essencial para decisões estratégicas como reforço de equipe e aumento de estoque nesses períodos. </p>

        <img src="../src/public/Grafico.svg" className={styles.img2} alt="Gráfico API" />
        <h4 className={styles.h4_2}>Descrição do (mês X) dos pedidos com mais saídas</h4>
        <p className={styles.Qtd_Saida_Insumo}>
          Insumos com maiores taxas de saída: <br />
          Insumo1-tantasSaídas <br />
          insumo 2-tantasSaídas <br />
          insumo 3-tantasSaídas <br />
          insumo 4-tantasSaídas <br />
          insumo 5-tantasSaídas <br />
          insumo 6-tantasSaídas <br />
        </p>
      </section>

      <section>

      {/* Não tá bonito pq o foco primordial é fazer ele funcional */}
        <CardGeral
          filtro="Funcionários"
          card={funcionarios}
        />

      </section>

    </div>
  )
}

export default Relatorios