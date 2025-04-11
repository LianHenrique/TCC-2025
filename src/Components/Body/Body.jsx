import styles from "./Body.module.css"

const Body = () => {

  return (
    // Adicionar as informações necessarias
    <div 
    className={styles.Body}>
        <div 
        className={styles.basePesquisa}>
            <input 
            type="text" 
            placeholder="Pesquisa" />
            <button className={styles.buttonCadastro}>
              Cadastrar
            </button>
        </div>
    </div>
  )

}

export default Body