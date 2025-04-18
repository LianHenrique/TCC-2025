import CardsCurso from "../../components/Cards/CardsCurso"
import CardsDescPlanoGratuito from "../../components/Cards/CardsDesc"
import NavBar from "../../components/NavBar/NavBar"
import styles from "../app.module.css"

function App() {

  return (
    <div>
      <NavBar />

      <CardsDescPlanoGratuito 
      titulo="Gerencie o estoque do seu negócio de maneira ágil"
      desc="Com o StoreBox, você pode gerenciar seus estoques
      de maneira eficiente, contendo relatórios e outras 
      funcionalidades que com toda certeza te auxiliarão!"
      botaoTxt="Teste gratis"
      comBotão={true}
      txtComBotao="Experimente gratis por 30 dias"/>

      <CardsCurso 
      cards={[
        {
          titulo: "Plano gratuito",
          req1: "Menor espaço",
          req2: "Sem todas funcionalidades",
          req3: "Usuario unico",
        },
        {
          titulo: "Plano gratuito",
          req1: "Menor espaço",
          req2: "Sem todas funcionalidades",
          req3: "Usuario unico",
        },
        {
          titulo: "Plano gratuito",
          req1: "Menor espaço",
          req2: "Sem todas funcionalidades",
          req3: "Usuario unico",
        },
        {
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
