import { useState, useEffect } from 'react';
import NavBar from "../../components/NavBar/NavBar";
import styles from './Home.module.css'; // Usando CSS Modules

function Home() {
  const [temaEscuro, setTemaEscuro] = useState(false);

  useEffect(() => {
    document.body.className = temaEscuro ? styles['dark-mode'] : styles['light-mode'];
  }, [temaEscuro]);

  const alternarTema = () => setTemaEscuro(prev => !prev);

  return (
    <div>
      <NavBar />

      <div className={styles.App}>
        {/* Botão de alternância de tema */}
        <button className={styles['theme-toggle-button']} onClick={alternarTema}>
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path
              fill="currentColor"
              d="M9.37,5.51C9.19,6.15,9.1,6.82,9.1,7.5c0,4.08,3.32,7.4,7.4,7.4c0.68,0,1.35-0.09,1.99-0.27C17.45,17.19,14.93,19,12,19 
              c-3.86,0-7-3.14-7-7C5,9.07,6.81,6.55,9.37,5.51z M12,3c-4.97,0-9,4.03-9,9s4.03,9,9,9s9-4.03,9-9c0-0.46-0.04-0.92-0.1-1.36 
              c-0.98,1.37-2.58,2.26-4.4,2.26c-2.98,0-5.4-2.42-5.4-5.4c0-1.81,0.89-3.42,2.26-4.4C12.92,3.04,12.46,3,12,3z"
            />
          </svg>
        </button>

        {/* Título e descrição */}
        <div className={styles.header}>
          <h1>
            Gerencie o <span className={styles.destaque}>estoque</span> do seu negócio de maneira ágil
          </h1>
          <p>StoreBox facilita o gerenciamento de estoques com eficiência e recursos úteis.</p>
        </div>

        {/* Botão de Teste Grátis + Frase */}
        <div className={styles.testeGratisContainer}>
          <button className={styles.botaoTesteGratis}>Teste Grátis</button>
          <span className={styles.bold}>Experimente grátis por 30 dias</span>
        </div>

        {/* Benefícios rápidos */}
        <div className={styles.beneficios}>
          <div><strong>1</strong> Acesso em tempo real</div>
          <div><strong>2</strong> Redução de erros</div>
          <div><strong>3</strong> Relatórios detalhados</div>
        </div>

        {/* Cartões de Planos */}
        <div className={styles.planos}>
          <div className={styles.card}>
            <h3>Plano 2</h3>
            <button className={styles.botaoTesteGratis}>Começar</button>
          </div>
          <div className={styles.card}>
            <h3>Plano 1</h3>
            <button className={styles.botaoTesteGratis}>Começar</button>
          </div>
          <div className={styles.card}>
            <h3>Gratis</h3>
            <p className={styles.cardText}>
              Experimente gratuitamente por 30 dias<br />
              • Uso limitado<br />
              • Sem recursos avançados<br />
              • Sem registro em reconhecimento<br />
              • Sem obrigação de faturamento
            </p>
            <button className={styles.botaoTesteGratis}>Começar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
