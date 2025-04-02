import styles from "./Body.module.css"
import { HiArchiveBoxXMark, HiArchiveBoxArrowDown } from "react-icons/hi2";

const Body = () => {

  return (
    // Adicionar as informações necessarias
    <div className={styles.Body}>
        <div className={styles.basePesquisa}>
          <input className={styles.input} type="text" />
          <button className={styles.buttonIcon}><HiArchiveBoxArrowDown className={styles.icon} /></button>
          <button className={styles.buttonIcon}><HiArchiveBoxXMark className={styles.icon} /></button>
        </div>
    </div>
  )

}

export default Body