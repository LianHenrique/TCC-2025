import HomeBarra from "../../Components/BarraInicial/HomeBarra"
import Body from "../../Components/Body/Body"
import styles from "../Pages.module.css"
import BarraFiltro from "../../Components/BarraFiltro/BarraFiltro"

const Funcionario = () => {
  return (
    <div className={styles.body}>
      <div className={styles.sistema}>
        <HomeBarra />
        <BarraFiltro id = {1}/>
        <Body />
      </div>
    </div>
  )
}

export default Funcionario