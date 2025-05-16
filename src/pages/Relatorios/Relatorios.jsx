import React from 'react'
import NavBar from '../../components/NavBar/NavBar'
import styles from './Relatorios.module.css'

const Relatorios = () => {
  return (
    <div>
        <section style={{paddingBottom:'8rem'}}>
            <NavBar/>
        </section>

        {/* Parte da descrição do relatório */}
        <section className={styles.EscopoRelatorio}>
            <img src="representacaografica.svg" className={styles.img} alt="Não carregou"/>
            <h4 className="fs-6 fs-md-5 fs-lg-4">Descrição do relatório de ganhos semanais (15 a 21 de abril de 2025)</h4>

            <p className="fs-6 fs-md-5 fs-lg-4">Durante a semana de 15 a 21 de abril de 2025, a hamburgueria apresentou variação nos ganhos diários. Na segunda-feira (15/04), os ganhos foram de R$800, subindo levemente na terça-feira (16/04) para R$950. Na quarta-feira (17/04), houve um aumento significativo, chegando a R$1.200. Quinta-feira (18/04) registrou um pequeno recuo para R$1.100.</p>

            <p className="fs-6 fs-md-5 fs-lg-4">O maior volume de vendas foi observado no fim de semana. Na sexta-feira (19/04), os ganhos saltaram para R$2.300, seguidos por um pico no sábado (20/04) com R$2.800, o dia mais lucrativo da semana. No domingo (21/04), os ganhos fecharam em R$2.000, mantendo o alto desempenho do fim de semana.</p>

            <p className="fs-6 fs-md-5 fs-lg-4">Esses dados mostram claramente o padrão de maior movimento nos últimos dias da semana, essencial para decisões estratégicas como reforço de equipe e aumento de estoque nesses períodos. </p>
        </section>
    </div>
  )
}

export default Relatorios