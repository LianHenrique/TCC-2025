import styles from "./Body.module.css"
import { HiArchiveBoxXMark, HiArchiveBoxArrowDown  } from "react-icons/hi2";
import { HiSearch } from "react-icons/hi";

const Body = () => {

  return (
    // Adicionar as informações necessarias
    <div 
    className={styles.Body}>
        <div 
        className={styles.basePesquisa}>
            <button>
              <HiSearch className={styles.icon}/>
              </button>
            <input 
            type="text" 
            placeholder="Pesquisa" />
        </div>
        <div 
        className={styles.baseAlteracao}>
          <button 
          className={styles.buttonIcon}>
            <HiArchiveBoxArrowDown 
            className={styles.icon} />
          </button>
          <button 
          className={styles.buttonIcon}>
            <HiArchiveBoxXMark 
            className={styles.icon} />
          </button>
          <input 
          className={styles.inputAlteração} 
          type="text" 
          placeholder="ID"/>
          <button 
          className={styles.buttonCadastro}>
            Cadastrar
          </button>
        </div>
    </div>
  )

}

export default Body