import HomeBarra from "../../Components/BarraInicial/HomeBarra"
import Body from "../../Components/Body/Body"
import styles from "../Pages.module.css"
import { useState } from "react"
import Menu from "../../Components/Menu/Menu"
import BarraFiltro from "../../Components/BarraFiltro/BarraFiltro"

const Funcionario = () => {
  const [menuAberto, useMenuAberto] = useState(false);

  return (
    <div className={styles.body}>
      {menuAberto && <Menu />}
      <div className={styles.sistema}>
        <HomeBarra 
        useMenuAberto = {useMenuAberto} 
        menuAberto = {menuAberto} />
        <BarraFiltro id = {3}/>
        <Body />
      </div>
    </div>
  )
}

export default Funcionario