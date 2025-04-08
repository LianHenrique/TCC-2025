import styles from "./Body.module.css"
import { HiSearch } from "react-icons/hi";

const Body = () => {

  return (
    // Adicionar as informações necessarias
    <div 
    className={styles.Body}>
        <div 
        className={styles.basePesquisa}>
            <button className={styles.buttonPesquisa}>
              <HiSearch className={styles.icon}/>
            </button>
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