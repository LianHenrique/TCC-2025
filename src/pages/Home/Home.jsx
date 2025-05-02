import React from 'react';
import CardsCurso from "../../components/Cards/CardsCurso";
import CardsDescPlanoGratuito from "../../components/Cards/CardsDesc";
import NavBar from "../../components/NavBar/NavBar";
import './Home.css';

function App() {
  return (
    <div>
      {/* NavBar Component */}
      <NavBar />

      {/* CardsDescPlanoGratuito Component */}
      <CardsDescPlanoGratuito 
        titulo={<span className="alexandria bold">Gerencie o <strong className="destaque">estoque</strong> do seu negócio de maneira ágil</span>}
        desc={<span className="alexandria2">StoreBox facilita o gerenciamento de estoques com eficiência e recursos úteis.</span>}
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
