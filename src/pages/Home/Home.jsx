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

      
      {<span className="alexandria2">1 Acesso em tempo real</span>}
      {<span className="alexandria2">2 Redução de erros</span>}
      {<span className="alexandria2">3 Relatórios detalhados</span>}

      {/* CardsCurso Component */}
      <CardsCurso 
        cards ={[
          {
            titulo: "Grátis",
            req1: "Experimente gratuito por 30 dias",
            req2: "Uso limitado",
            req3: "Sem recursos adicionais",
            req4: "Sem imagem de reconhecimento",
            req5: "Sem cadastro de funcionarios",
          },
          {
            titulo: "Plano 1",
            req1: " ",
          },
          {
            titulo: "Plano 2",
            req1: " ",
          },
          
        ]}
      />
    </div>
  );
}

export default App;
