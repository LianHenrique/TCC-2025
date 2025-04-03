import HomeBarra from "../../Components/BarraInicial/HomeBarra"
import Body from "../../Components/Body/Body"
import Menu from "../../Components/Menu/Menu";
import styles from "../Pages.module.css"
import { useState } from "react";
import BarraFiltro from "../../Components/BarraFiltro/BarraFiltro";

const Franquias = () => {
  const [menuAberto, useMenuAberto] = useState(false);

  return (
    <div className={styles.body}>
      {menuAberto && <Menu />}
      <div className={styles.sistema}>
        <HomeBarra 
        useMenuAberto = {useMenuAberto} 
        menuAberto = {menuAberto} />
        <BarraFiltro id = {2}/>
        <Body />
      </div>
    </div>
  )
}

export default Franquias