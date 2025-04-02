import HomeBarra from "../../Components/BarraInicial/HomeBarra"
import FranquiasBarraFiltro from "../../Components/Franquias/BarraFilter/FranquiasBarraFiltro"
import Body from "../../Components/Body/Body"
import Menu from "../../Components/Menu/Menu";
import styles from "../Pages.module.css"
import { useState } from "react";

const Franquias = () => {
  const [menuAberto, useMenuAberto] = useState(false);

  return (
    <div className={styles.body}>
      {menuAberto && <Menu />}
      <div className={styles.sistema}>
        <HomeBarra 
        useMenuAberto = {useMenuAberto} 
        menuAberto = {menuAberto} />
        <FranquiasBarraFiltro />
        <Body />
      </div>
    </div>
  )
}

export default Franquias