import styles from './Agenda.module.css';
import calendarioIcone from '../../assets/calendar-icon.png'; // substitua por seu caminho real

function Agenda() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <img
          src={calendarioIcone}
          alt="Ícone de calendário"
          className={styles.icone}
        />
      </div>

      <div className={styles.texto}>
        <h2>Desempenho de Segunda-feira 15 de Abril de 2025</h2>
        <p>
          Na segunda-feira, 15 de abril, a hamburgueria registrou um ganho de R$800, marcando o início da semana com um ritmo mais moderado de vendas. Esse valor está dentro da média esperada para o primeiro dia útil, quando o fluxo de clientes tende a ser mais baixo devido à retomada da rotina após o final de semana. Tradicionalmente, segundas-feiras são dias mais calmos no setor de alimentação fora do lar, especialmente em estabelecimentos voltados para o consumo noturno e lazer, como hamburguerias.
        </p>
        <p>
          Apesar do movimento reduzido, os R$800 arrecadados representam uma oportunidade de análise e melhoria. Com base nesse comportamento, é possível pensar em estratégias específicas para impulsionar as vendas nesse dia, como promoções exclusivas de segunda-feira, combos especiais, cupons de desconto ou até mesmo parcerias com aplicativos de entrega. Além disso, o menor fluxo também pode ser positivo para testes de novos produtos e treinamento de equipe, já que a operação se mantém mais controlada.
        </p>
        <p>
          O desempenho da segunda-feira, portanto, não deve ser visto apenas como um número inferior aos demais dias da semana, mas sim como uma base estratégica. Com boas ações de marketing e fidelização, esse dia pode se tornar uma oportunidade de crescimento e diferenciação no mercado.
        </p>
      </div>
    </div>
  );
}

export default Agenda;
