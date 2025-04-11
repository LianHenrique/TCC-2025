import Body from "../../Components/Body/Body"
import styles from "../Pages.module.css"
import BarraFiltro from "../../Components/BarraFiltro/BarraFiltro"

const Relatorio = () => {
  return (
    <div className={styles.body}>
      <div className={styles.sistema}>
        <BarraFiltro id = {3}/>
        <Body />
      </div>
    </div>
  )
}

export default Relatorio