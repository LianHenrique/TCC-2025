import CardsCurso from "../../components/Cards/CardsCurso"
import CardsDescPlanoGratuito from "../../components/Cards/CardsDescPlanoGratuito"
import NavBar from "../../components/NavBar/NavBar"
import styles from "../app.module.css"

function App() {

  return (
    <div>
      <NavBar />

      <CardsDescPlanoGratuito />

      <CardsCurso 
      cards={[
        {
          key: 1,
          titulo: "Plano gratuito",
          req1: "Menor espaço",
          req2: "Sem todas funcionalidades",
          req3: "Usuario unico",
        },
        {
          key: 2,
          titulo: "Plano gratuito",
          req1: "Menor espaço",
          req2: "Sem todas funcionalidades",
          req3: "Usuario unico",
        },
        {
          key: 3,
          titulo: "Plano gratuito",
          req1: "Menor espaço",
          req2: "Sem todas funcionalidades",
          req3: "Usuario unico",
        },
        {
          key: 4,
          titulo: "Plano gratuito",
          req1: "Menor espaço",
          req2: "Sem todas funcionalidades",
          req3: "Usuario unico",
        },
      ]}/>
    </div>
  )
}

export default App
