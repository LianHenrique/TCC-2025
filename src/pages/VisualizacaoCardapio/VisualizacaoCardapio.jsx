import styles from './VisualizacaoInsumo.module.css';
import hamburguerIcon from '../../assets/hamburguer-icon.png'; // Substitua pelo caminho correto
import { FaTrash, FaEdit } from 'react-icons/fa';

function VisualizacaoInsumo() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.topSection}>
        <div className={styles.imagemBox}>
          <img src={hamburguerIcon} alt="Ícone do produto" />
        </div>
        <div className={styles.descricao}>
          <h2>Descrição do Insumo: <span className={styles.destaque}>Queijo</span></h2>
          <ul>
            <li>Data de Entrada: 20/05/2025</li>
            <li>Fornecedor: Wesley</li>
            <li>Quantidade Comprada: 5 kg</li>
            <li>Valor Pago por kg: R$ 20,00</li>
            <li>Valor Total: R$ 100,00</li>
            <li>Validade em Estoque: 15 dias (até 04/06/2025)</li>
            <li>Validade Fora de Estoque (após retirada para uso): 4 horas</li>
          </ul>
          <p className={styles.observacoes}>
            <strong>Observações:</strong><br />
            O produto deve ser armazenado sob refrigeração adequada e, uma vez retirado do estoque, deve ser utilizado em até 4 horas
            para garantir a segurança e qualidade do alimento.
          </p>
        </div>
      </div>

      <div className={styles.cardContainer}>
        {Array.from({ length: 4 }).map((_, index) => (
          <div className={styles.funcionarioCard} key={index}>
            <div className={styles.imgPlaceholder}></div>
            <p>Funcionário</p>
            <div className={styles.acoes}>
              <button className={styles.botaoExcluir}><FaTrash /></button>
              <button className={styles.botaoEditar}><FaEdit /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VisualizacaoInsumo;
