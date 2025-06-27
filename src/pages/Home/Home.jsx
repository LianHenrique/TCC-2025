import { useState, useEffect } from 'react';
import NavBar from "../../components/NavBar/NavBar";
import styles from './Home.module.css';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [temaEscuro] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.className = temaEscuro ? styles['dark-mode'] : styles['light-mode'];
  }, [temaEscuro]);

  return (
    <div>
      <NavBar />

      <div className={styles.App}>
        <div className={styles.header}>
          <h2 style={{
            marginTop: "50px"
          }}>
            Gerencie o <span className={styles.destaque}>estoque</span> do seu <br />
            negócio de maneira ágil
          </h2>
          <p>
            A StoryBox é uma solução completa para o gerenciamento de estoques, oferecendo ferramentas intuitivas
            e recursos avançados que otimizam processos, reduzem erros e aumentam a eficiência operacional.
            Com uma interface amigável e funcionalidades inteligentes, ela facilita o controle de entradas e saídas,
            o acompanhamento dos níveis de estoque e a tomada de decisões estratégicas com base em dados precisos e em tempo real.
          </p>
        </div>

        <div className={`${styles.testeGratisContainer} ${styles.alinharEsquerda}`}>
          <button
            className={styles.botaoTesteGratis}
            onClick={() => navigate("/cadastro")}
          >
            Teste Grátis
          </button>
          <span className={styles.bold}>Experimente grátis por 30 dias</span>
        </div>

        <div className={styles.beneficios}>
          <div style={{
              color: "black"
            }} className={`${styles.beneficioCard} ${styles.beneficio2}`}>Acesso em tempo real</div>
          <div style={{
              color: "black"
            }} className={`${styles.beneficioCard} ${styles.beneficio2}`}>Redução de erros</div>
          <div style={{
              color: "black"
            }} className={`${styles.beneficioCard} ${styles.beneficio2}`}>Relatórios detalhados</div>
        </div>

        <div className={styles.planos}>
          <div className={styles.card}>
            <h3 style={{
              color: "black"
            }}>Grátis</h3>
            <p className={styles.cardText} style={{
              color: "black"
            }}>
              Experimente gratuitamente por 30 dias<br /><br />
              • Uso limitado<br />
              • Sem recursos avançados<br />
              • Sem registro em reconhecimento<br />
              • Sem obrigação de faturamento
            </p>
            <button className={styles.botaoTesteGratis2} onClick={() => navigate("/cadastro")}>
              Começar
            </button>
          </div>

          <div className={styles.card}>
            <h3 style={{
              color: "black"
            }}>Plano 1</h3>
            <p className={styles.cardText}>
              Experimente o melhor plano<br /><br />
              • Uso ilimitado<br />
              • Com recursos avançados<br />
              • Com registro em reconhecimento<br />
              • Com obrigação de faturamento
            </p>
            <button className={styles.botaoTesteGratis2} onClick={() => navigate("/cadastro")}>
              Começar
            </button>
          </div>

          <div className={styles.card}>
            <h3 style={{
              color: "black"
            }}>Plano 2</h3>
            <p className={styles.cardText}>
              Experimente o primeiro plano <br /><br />
              • Uso ilimitado<br />
              • Início dos recursos avançados<br />
              • Sem registro em reconhecimento<br />
              • Sem obrigação de faturamento
            </p>
            <button className={styles.botaoTesteGratis2} onClick={() => navigate("/cadastro")}>
              Começar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;