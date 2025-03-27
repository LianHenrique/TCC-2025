import './App.css'
import EstoqueBarraFiltro from './Components/Estoque/BarraFilter/EstoqueBarraFiltro'
import EstoqueHomeBarra from './Components/Estoque/BarraInicial/EstoqueHomeBarra'
import EstoqueBody from './Components/Estoque/Body/EstoqueBody'

function App() {

  return (
    <div>
      <EstoqueHomeBarra />
      <EstoqueBarraFiltro />
      <EstoqueBody/>
    </div>
  )
}

export default App
