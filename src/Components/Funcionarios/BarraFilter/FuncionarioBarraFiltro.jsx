import styles from "./FuncionarioBarraFiltro.module.css"

const BarraFiltro = () => {

  return (
    <div className={styles.body}>
        <div>
            {/* Botão para a tela funcionario */}
            <button className={styles.buttonAtual}>
                Funcionarios
            </button>
            {/* Botão indicativo da tela atual Estoque */}
            <button className={styles.buttonOtherPage}>
                Estoque
            </button>
            {/* Botão para a tela Franquias */}
            <button className={styles.buttonOtherPage}>
                Franquias
            </button>
        </div>
    </div>
  )
  
}

export default BarraFiltro