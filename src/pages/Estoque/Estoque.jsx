import HomeBarra from "../../Components/BarraInicial/HomeBarra"
import EstoqueBarraFiltro from "../../Components/Estoque/BarraFilter/EstoqueBarraFiltro"
import Body from "../../Components/Body/Body"
import Menu from "../../Components/Menu/Menu"
import styles from "./Estoque.module.css"
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
        <EstoqueBarraFiltro />
        <Body />
      </div>
    </div>
  )
}

export default Estoque