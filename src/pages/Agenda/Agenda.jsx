import styles from './Agenda.module.css';
import calendarioIcone from '../../assets/calendar-icon.png'; // Substitua pelo caminho real da imagem

function Agenda() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {/* Ícone de calendário */}
        <div className={styles.card}>
          <img
            src={calendarioIcone}
            alt="Ícone de calendário"
            className={styles.icone}
          />
        </div>

        {/* Texto de desempenho */}
        <div className={styles.texto}>
          <h2>
            Desempenho de <span className={styles.destaque}>Segunda-feira, 15 de Abril de 2025</span>
          </h2>
          <p>
            Na segunda-feira, 15 de abril, a hamburgueria registrou um ganho de <strong>R$800</strong>, marcando o início
            da semana com um ritmo mais moderado de vendas. Esse valor está dentro da média esperada para o primeiro dia
            útil, quando o fluxo de clientes tende a ser mais baixo devido à retomada da rotina após o final de semana.
          </p>
          <p>
            Apesar do movimento reduzido, os <strong>R$800</strong> arrecadados representam uma oportunidade de análise e melhoria.
            Com base nesse comportamento, é possível pensar em estratégias específicas para impulsionar as vendas nesse dia,
            como promoções exclusivas, combos especiais ou parcerias com apps de entrega.
          </p>
          <p>
            O desempenho da segunda-feira não deve ser visto apenas como um número inferior, mas sim como uma <strong>base estratégica</strong>.
            Com boas ações de marketing e fidelização, esse dia pode se tornar uma excelente oportunidade de crescimento.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Agenda;
