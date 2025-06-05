import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import NavBar from '../../components/NavBar/NavBar';
import Pesquisa from '../../components/Pesquisa/Pesquisa';
import { Button, Container } from 'react-bootstrap';
import CardGeral from '../../components/Cards/CardGeral';

const Estoque = () => {
  const [produtos, setProdutos] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3000/insumos')
    fetch('http://localhost:3000/cardapio')
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) {
          throw new Error("Resposta inesperada da API");
        }

        const agrupados = data.reduce((acc, produto) => {
          const cat = produto.categoria || 'Outros';

          if (!acc[cat]) {
            acc[cat] = [];
          }

          const entradaFormatada = new Date(produto.data_vencimento_prod).toLocaleDateString()

          acc[cat].push({
            id: produto.id_cardapio,
            nome: produto.nome_item,
            link: produto.imagem_url || 'https://cdn.melhoreshospedagem.com/wp/wp-content/uploads/2023/07/erro-404.jpg',
            descricao: [ 
              { texto: `Nome: ${entradaFormatada}` },
              { texto: `Nome: ${produtos.nome_item}` }
            ]
          });

          return acc;
        }, {});

        setProdutos(agrupados);
      })
      .catch(err => console.error('Erro ao buscar produtos:', err));
  }, []);

  const handleCardClick = (id) => {
    navigate(`/visualizar/${id}`);
  };

  return (
    <div>
      <NavBar />
      <Container className="my-4">
        <Pesquisa
          nomeDrop="Filtro"
          navega="/cadastro_insumos"
          lista={[
            { texto: "Carnes", link: "#carnes" },
            { texto: "Bebidas", link: "#bebidas" },
            { texto: "Saladas", link: "#saladas" },
          ]}
        />

        {Object.entries(produtos).map(([categoria, produtosDaCategoria]) => (
          <div key={categoria} id={categoria.toLowerCase()} className="mb-5">
            <h2 className="mb-3">{categoria}</h2>
            <CardGeral
              filtro="produtos"
              card={produtosDaCategoria}
              onCardClick={handleCardClick}
            />
          </div>
        ))}
      </Container>
    </div>
  );
};

export default Estoque;
