import HomeBarra from "../../Components/BarraInicial/HomeBarra"
import FuncionarioBarraFiltro from "../../Components/Funcionarios/BarraFilter/FuncionarioBarraFiltro"
import Body from "../../Components/Body/Body"
import styles from "../Pages.module.css"
import { useState } from "react"
import Menu from "../../Components/Menu/Menu"

const Funcionario = () => {
  const [menuAberto, useMenuAberto] = useState(false);

  return (
    <div className={styles.body}>
      {menuAberto && <Menu />}
      <div className={styles.sistema}>
        <HomeBarra 
        useMenuAberto = {useMenuAberto} 
        menuAberto = {menuAberto} />
        <FuncionarioBarraFiltro />
        <Body />
      </div>
    </div>
  )
}

export default Funcionario