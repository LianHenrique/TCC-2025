
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import NavBar from '../../components/NavBar/NavBar';
import Pesquisa from '../../components/Pesquisa/Pesquisa';
import { Button, Container } from 'react-bootstrap';
import CardGeral from '../../components/Cards/CardGeral';
import EditarQuantidade from '../../components/EditarQuantidadeProd/EditarQuantidade';
import { FaEdit, FaRegTrashAlt } from 'react-icons/fa';

const Estoque = () => {
  const [produtos, setProdutos] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3000/estoque')
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) {
          throw new Error("Resposta inesperada da API");
        }

        const agrupados = data.reduce((acc, insumos) => {
          const cat = insumos.categoria || 'Outros';

          if (!acc[cat]) {
            acc[cat] = [];
          }

          const entradaFormatada = insumos.data_entrada_insumos
            ? new Date(insumos.data_entrada_insumos).toLocaleDateString()
            : 'Data desconhecida';

          acc[cat].push({
            id: insumos.id_insumos,
            nome: insumos.nome_insumos,
            data: entradaFormatada,
            quantidade: insumos.quantidade_insumos,
            link: insumos.imagem_url || 'https://cdn.melhoreshospedagem.com/wp/wp-content/uploads/2023/07/erro-404.jpg',
            descricao: [
              { texto: `Quantidade: ${insumos.quantidade_insumos}` },
              { texto: `Nome: ${insumos.nome_insumos}` }
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

  // Requisição para deletar, linha: 608
  const handleDelete = (id) => {
    fetch(`http://localhost:3000/estoqueDeletarIten/${id}`, {
      method: 'DELETE'
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao deletar o item')
        }
        return response.json()
      })
      .then(data => {
        console.log("Item deletado com sucesso", data)
        window.location.reload();
      })
      .catch(error => {
        console.error('Erro:', error)
      })
  }


  return (
    <div>
      <NavBar />
      <Container className="my-4">
        <h1
          style={{
            marginTop: "100px"
          }}>Estoque</h1>
        <Pesquisa
          nomeDrop="Filtro"
          navega="/cadastro_insumos"
          lista={[
            { texto: "Carnes", link: "#carnes" },
            { texto: "Bebidas", link: "#bebidas" },
            { texto: "Saladas", link: "#saladas" },
          ]}
        />

        {/* <EditarQuantidade quantidade={0}/> */}

        {Object.entries(produtos).map(([categoria, produtosDaCategoria]) => (
          <div key={categoria} id={categoria.toLowerCase()} className="mb-5">
            <h2 className="mb-3">{categoria}</h2>
            <CardGeral
              card={produtosDaCategoria}
              onCardClick={handleCardClick}
              imgHeight={250}
              showButtons={false}
              customButton={(item) => (
                <>
                  <Button
                    variant="warning"
                    className="rounded-circle fs-5 text-center shadow m-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (item.acoes && item.acoes[0]?.onClick)
                        item.acoes[0].onClick();
                    }}
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    variant="danger"
                    className="rounded-circle fs-5 text-center shadow m-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.id);
                    }}
                  >
                    <FaRegTrashAlt />
                  </Button>
                </>
              )}
            />
          </div>
        ))}
      </Container>
    </div>
  );
};

export default Estoque;
