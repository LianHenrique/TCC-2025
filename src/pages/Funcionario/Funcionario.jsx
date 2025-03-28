import HomeBarra from "../../Components/BarraInicial/HomeBarra"
import FuncionarioBarraFiltro from "../../Components/Funcionarios/BarraFilter/FuncionarioBarraFiltro"
import Body from "../../Components/Body/Body"

const Funcionario = () => {
  return (
    <div>
        <HomeBarra />
        <FuncionarioBarraFiltro />
        <Body />
    </div>
  )
}

export default Funcionario