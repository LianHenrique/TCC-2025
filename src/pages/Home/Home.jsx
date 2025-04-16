import CardsCurso from "../../components/Cards/CardsCurso"
import NavBar from "../../components/NavBar/NavBar"
import styles from "../app.module.css"

function App() {

  return (
    <div>
      <NavBar />
      <CardsCurso 
      titulo="Plano gratuito"
      req1="Menor espaço"
      req2="Sem todas funcionalidades"
      req3="Usuario unico"/>
    </div>
  )
}

export default App
