import styles from "./Body.module.css"
import { HiArchiveBoxXMark, HiArchiveBoxArrowDown } from "react-icons/hi2";

const Body = () => {

  return (
    // Adicionar as informações necessarias
    <div className={styles.Body}>
      <div>
        <input type="text" />
        <button><HiArchiveBoxArrowDown className={styles.icon} /></button>
        <button><HiArchiveBoxXMark /></button>
      </div>
    </div>
  )

}

export default Body