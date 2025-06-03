import NavBar from '../../components/NavBar/NavBar'
import Pesquisa from '../../components/Pesquisa/Pesquisa'
import { Button, Container } from 'react-bootstrap'
import CardGeral from '../../components/Cards/CardGeral'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

const Estoque = () => {
  const [produtos, setProdutos] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    fetch('http://localhost:3000/insumos') 
      .then(res => res.json())
      .then(data => {
        const agrupados = data.reduce((acc, produto) => {
          const cat = produto.categoria || 'Outros'  
          
          if (!acc[cat]) {
            acc[cat] = []
          }
          
          acc[cat].push({
            id: produto.id_produto,
            nome: produto.nome_produto,
            link: produto.imagem_url || 'https://via.placeholder.com/150',
            descricao: [
              { texto: `Quantidade: ${produto.QTD_produto}` },
              { texto: `Entrada: ${new Date(produto.QTD_entrada_produto).toLocaleDateString()}` }
            ]
          })
          
          return acc
        }, {})
        
        setProdutos(agrupados)
      })
      .catch(err => console.error(err))
  }, [])

  function handleCardClick(id) {
    navigate(`/visualizar/${id}`)
  }

  return (
    <div>
      <NavBar />
      <Container>
        <Pesquisa 
          nomeDrop="Filtro" 
          lista={[
            { texto: "Carnes", link: "#carnes" },
            { texto: "Bebidas", link: "#bebidas" },
            { texto: "Saladas", link: "#saladas" },
          ]}
        />
        <Button className="shadow rounded-5">Cadastrar</Button>
        
        {Object.entries(produtos).map(([categoria, produtosDaCategoria]) => (
          <div key={categoria} style={{ marginBottom: '2rem' }}>
            <h2>{categoria}</h2>
            <CardGeral
              filtro="produtos"
              card={produtosDaCategoria}
              onCardClick={handleCardClick}
            />
          </div>
        ))}
      </Container>
    </div>
  )
}

export default Estoque