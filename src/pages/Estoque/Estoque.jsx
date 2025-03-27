import HomeBarra from "../../Components/BarraInicial/HomeBarra"
import EstoqueBarraFiltro from "../../Components/Estoque/BarraFilter/EstoqueBarraFiltro"
import Body from "../../Components/Body/Body"

const Estoque = () => {
  return (
    <div>
        <HomeBarra />
        <EstoqueBarraFiltro />
        <Body />
    </div>
  )
}

export default Estoque