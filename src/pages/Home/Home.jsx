import React from 'react';
import CardsCurso from "../../components/Cards/CardsCurso";
import CardsDescPlanoGratuito from "../../components/Cards/CardsDesc";
import NavBar from "../../components/NavBar/NavBar";
import Styles from "../app.module.css";

function App() {

  return (
    <div>
      {/* NavBar Component */}
      <NavBar />

      {/* CardsDescPlanoGratuito Component */}
      <CardsDescPlanoGratuito 
        titulo="Gerencie o estoque do seu negócio de maneira ágil"
        desc="Com o StoreBox, você pode gerenciar seus estoques de maneira eficiente, contendo relatórios e outras funcionalidades que com toda certeza te auxiliarão!"
        botaoTxt="Teste grátis"
        comBotão={true}
        txtComBotao="Experimente grátis por 30 dias"
      />

      {/* CardsCurso Component */}
      <CardsCurso 
        cards={[
          {
            titulo: "Plano gratuito",
            req1: "Menor espaço",
            req2: "Sem todas funcionalidades",
            req3: "Usuário único",
          },
          {
            titulo: "Plano 1",
            req1: "Espaço maior",
            req2: "Recursos adicionais",
            req3: "Usuário múltiplo",
          },
          {
            titulo: "Plano 2",
            req1: "Espaço ilimitado",
            req2: "Todas funcionalidades",
            req3: "Usuários ilimitados",
          },
          {
            titulo: "Plano 3",
            req1: "Espaço personalizável",
            req2: "Funcionalidades extras",
            req3: "Usuários ilimitados",
          },
        ]}
      />
    </div>
  );
}

export default App;
