import BarraFiltro from "../../Components/BarraFiltro/BarraFiltro"
import HomeBarra from "../../Components/BarraInicial/HomeBarra"
import Body from "../../Components/Body/Body"
import styles from "../Pages.module.css"

const Estoque = () => {
  return (
    <div className={styles.body}>
      <div className={styles.sistema}>
        <HomeBarra />
        <BarraFiltro id = {2}/>
        <Body />
      </div>
    </div>
  )
}

export default Estoque