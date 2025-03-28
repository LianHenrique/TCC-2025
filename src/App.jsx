import './App.css'
import Estoque from './pages/Estoque/Estoque';
import Franquias from './pages/Franquias/Franquias';
import Funcionario from './pages/Funcionario/Funcionario';
import HomeLogin from './pages/Login/HomeLogin'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomeLogin />} />
        <Route path='/estoque' element={<Estoque />} />
        <Route path='/funcionario' element={<Funcionario />} />
        <Route path='/franquias' element={<Franquias />} />
      </Routes>
    </Router>
  )
}

export default App
