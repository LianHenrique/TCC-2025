import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import NavBar from '../../components/NavBar/NavBar';
import Pesquisa from '../../components/Pesquisa/Pesquisa';
import { Container } from 'react-bootstrap';
import CardGeral from '../../components/Cards/CardGeral';
import EditarQuantidade from '../../components/EditarQuantidadeProd/EditarQuantidade';
import { FaEdit, FaRegTrashAlt } from 'react-icons/fa';
import Button from 'react-bootstrap/Button'; 

const Estoque = () => {
  const [produtos, setProdutos] = useState({});
  const [produtosOriginais, setProdutosOriginais] = useState([]); // manter todos os produtos
  const [filtro, setFiltro] = useState({ texto: '', filtro: '' });
  const navigate = useNavigate()

  useEffect(() => {
    fetch('http://localhost:3000/estoque')
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) {
          throw new Error("Resposta inesperada da API");
        }
        setProdutosOriginais(data); // salva os originais
        aplicarFiltro(data, filtro); // aplica o filtro atual
      })
      .catch(err => console.error('Erro ao buscar produtos:', err));
  }, []);

  useEffect(() => {
    aplicarFiltro(produtosOriginais, filtro);
  }, [filtro]);

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

  const aplicarFiltro = (data, filtro) => {
  const { texto, filtro: categoriaFiltro } = filtro;

  const removerAcentos = (texto) => {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const filtrado = data.filter(insumo => {
    const correspondeTexto = texto
      ? removerAcentos(insumo.nome_insumos.toLowerCase()).includes(removerAcentos(texto.toLowerCase()))
      : true;

    const correspondeCategoria = categoriaFiltro
      ? insumo.categoria?.toLowerCase() === categoriaFiltro.toLowerCase()
      : true;

    return correspondeTexto && correspondeCategoria;
  });

  // resto igual, agrupando e setando produtos
  const agrupados = filtrado.reduce((acc, insumo) => {
    const cat = insumo.categoria || 'Outros';

    if (!acc[cat]) acc[cat] = [];

    const entradaFormatada = insumo.data_entrada_insumos
      ? new Date(insumo.data_entrada_insumos).toLocaleDateString()
      : 'Data desconhecida';

    acc[cat].push({
      id: insumo.id_insumos,
      nome: insumo.nome_insumos,
      data: entradaFormatada,
      quantidade: insumo.quantidade_insumos,
      link: insumo.imagem_url || 'https://cdn.melhoreshospedagem.com/wp/wp-content/uploads/2023/07/erro-404.jpg',
      descricao: [
        { texto: `Quantidade: ${insumo.quantidade_insumos}` },
        { texto: `Nome: ${insumo.nome_insumos}` }
      ]
    });

    return acc;
  }, {});

  setProdutos(agrupados);
};
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
          onFilterChange={setFiltro}
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