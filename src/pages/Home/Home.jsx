import { useState, useEffect } from 'react';
import NavBar from "../../components/NavBar/NavBar";
import styles from './Home.module.css'; // Usando CSS Modules
import { useNavigate } from 'react-router';

function Home() {
  const [temaEscuro, setTemaEscuro] = useState(false);

  const navigate = useNavigate()

  useEffect(() => {
    document.body.className = temaEscuro ? styles['dark-mode'] : styles['light-mode'];
  }, [temaEscuro]);

  const alternarTema = () => setTemaEscuro(prev => !prev);

  return (
    <div>
      <NavBar />

      <div className={styles.App}>
        {/* Botão de alternância de tema */}
        {/* <button className={styles['theme-toggle-button']} onClick={alternarTema}>
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path
              fill="currentColor"
              d="M9.37,5.51C9.19,6.15,9.1,6.82,9.1,7.5c0,4.08,3.32,7.4,7.4,7.4c0.68,0,1.35-0.09,1.99-0.27C17.45,17.19,14.93,19,12,19 
              c-3.86,0-7-3.14-7-7C5,9.07,6.81,6.55,9.37,5.51z M12,3c-4.97,0-9,4.03-9,9s4.03,9,9,9s9-4.03,9-9c0-0.46-0.04-0.92-0.1-1.36 
              c-0.98,1.37-2.58,2.26-4.4,2.26c-2.98,0-5.4-2.42-5.4-5.4c0-1.81,0.89-3.42,2.26-4.4C12.92,3.04,12.46,3,12,3z"
            />
          </svg>
        </button> */}

        {/* Título e descrição */}
        <div className={styles.header}
          style={{
            marginTop: "50px"
          }}>
          <h1>
            Gerencie o <span className={styles.destaque}>estoque</span> do seu negócio de maneira ágil
          </h1>
          <p
            style={{
              width: "600px",
              textAlign: "justify",
              paddingTop: "10px"
            }}>
            A StoryBox é uma solução completa para o gerenciamento de estoques, oferecendo ferramentas intuitivas e recursos avançados que otimizam processos, reduzem erros e aumentam a eficiência operacional. Com uma interface amigável e funcionalidades inteligentes, ela facilita o controle de entradas e saídas, o acompanhamento de níveis de estoque e a tomada de decisões estratégicas com base em dados precisos e em tempo real.</p>
        </div>

        {/* Botão de Teste Grátis + Frase */}
        <div className={styles.testeGratisContainer}>
          <button className={styles.botaoTesteGratis}
            onClick={() => {
              navigate("/cadastro")
            }}
          >Teste Grátis</button>
          <span className={styles.bold}>Experimente grátis por 30 dias</span>
        </div>

        {/* Benefícios rápidos */}
        <div className={styles.beneficios}>
          <div className='shadow'>Acesso em tempo real</div>
          <div className='shadow'>Redução de erros</div>
          <div className='shadow'>Relatórios detalhados</div>
        </div>

        {/* Cartões de Planos */}
        <div className={styles.planos}>
          <div className={styles.card}>
            <h3>Gratis</h3>
            <p className={styles.cardText}>
              Experimente gratuitamente por 30 dias<br /><br />
              • Uso limitado<br /><br />
              • Sem recursos avançados<br /><br />
              • Sem registro em reconhecimento<br /><br />
              • Sem obrigação de faturamento
            </p>
            <button className={styles.botaoTesteGratis2}
              onClick={() => {
                navigate("/cadastro")
              }}
            >Começar</button>
          </div>
          <div className={styles.card}>
            <h3>Plano 1</h3>
            <p className={styles.cardText}>
              Experimente o melhor plano<br /><br />
              • Uso ilimitado<br /><br />
              • Com recursos avançados<br /><br />
              • Com registro em reconhecimento<br /><br />
              • Com obrigação de faturamento<br /><br />
              (mudar dps)
            </p>
            <button className={styles.botaoTesteGratis2}
              onClick={() => {
                navigate("/cadastro")
              }}
            >Começar</button>
          </div>
          <div className={styles.card}>
            <h3>Plano 2</h3>
            <p className={styles.cardText}>
              Experimente o primeiro plano <br /><br />
              • Uso ilimitado<br /><br />
              • inicio dos reursos avançados<br /><br />
              • Sem registro em reconhecimento<br /><br />
              • Sem obrigação de faturamento<br /><br />
              (mudar dps)
            </p>
            <button className={styles.botaoTesteGratis2}
              onClick={() => {
                navigate("/cadastro")
              }}
            >Começar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
