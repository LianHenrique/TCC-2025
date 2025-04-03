import BarraFiltro from "../../Components/BarraFiltro/BarraFiltro"
import HomeBarra from "../../Components/BarraInicial/HomeBarra"
import Body from "../../Components/Body/Body"
import Menu from "../../Components/Menu/Menu"
import styles from "../Pages.module.css"
import { useState } from "react"

const Estoque = () => {
  const [menuAberto, useMenuAberto] = useState(false);

  return (
    <div className={styles.body}>
      {menuAberto && <Menu />}
      <div className={styles.sistema}>
        <HomeBarra 
        useMenuAberto = {useMenuAberto} 
        menuAberto = {menuAberto} />
        <BarraFiltro id = {1}/>
        <Body />
      </div>
    </div>
  )
}

export default Estoque