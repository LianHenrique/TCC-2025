import HomeBarra from "../../Components/BarraInicial/HomeBarra"
import FranquiasBarraFiltro from "../../Components/Franquias/BarraFilter/FranquiasBarraFiltro"
import Body from "../../Components/Body/Body"

const Franquias = () => {
  return (
    <div>
        <HomeBarra />
        <FranquiasBarraFiltro />
        <Body />
    </div>
  )
}

export default Franquias