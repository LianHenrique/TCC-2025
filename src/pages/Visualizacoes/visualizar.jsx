import React, { useState, useEffect } from 'react'
import Navbar from '../../components/NavBar/NavBar'
import CardGeral from '../../components/Cards/CardGeral'
import { Container } from 'react-bootstrap'
import style from './visualizar.module.css'

// tem que pegar o id da tela de cardápio, props.
const Visualizar = () => {

    // Depois eu vou colocar o id como useparams() quando ela for integrada com a tela de estoque e funcionários, não fiz agora pq tava muito difícil pra fazer os testes.

    // Eu personalizei essse código apenas para testar se a requisição tá certa e fazer a bomba do css logo, por que ele não tá integrado nem com funcionário e nem com cardápio , pq fazer isso sem ter o código pronto é difícl demais. :/

    const id = 1
    const [produtos, setProdutos] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        console.log("Use effect disparou. id igual a:", id)

        if (!id) {
            setProdutos([]);
            setLoading(false);
            return
        }

        fetch(`http://localhost:3000/produto/${id}`)
            .then(response => {
                if (!response.ok) throw new Error('Produto não encontrado')
                return response.json()
            })
            .then(data => {
                const produtoArray = Array.isArray(data) ? data : [data]
                const produtosFormatados = produtoArray.map(produto => ({
                    nome: produto.nome_produto || 'Sem nome',
                    link: 'https://cdn.oantagonista.com/uploads/2024/10/Coca-Cola_1729950505807-1024x576.jpg',
                    descricao: [
                        { texto: `Quantidade: ${produto.QTD_produto ?? 'N/A'}` },
                        { texto: `Entrada: ${produto.QTD_entrada_produto ? new Date(produto.QTD_entrada_produto).toLocaleDateString() : 'N/A'}` },
                        { texto: `Vencimento: ${produto.data_vencimento_prod ? new Date(produto.data_vencimento_prod).toLocaleDateString() : 'N/A'}` },
                    ]

                }))
                // Vendo se passou
                console.log('Dados recebidos:', produtosFormatados)

                setProdutos(produtosFormatados)
                setLoading(false)
                setError(null)
            })
            .catch(error => {
                console.log("ERro ao buscar produto", error)
                setProdutos([])
                setLoading(false)
                setError(error.message)
            })
    }, [id])

    if (loading) return <p>Carregando produto...</p>
    if (error) return <p>{error}</p>

    return (

        <div>
            <Navbar />
            <Container className={style.Container}>
                {/* Se o id for vazio, então: */}
                {!id ? (
                    <section>
                        <img src="https://www.freeiconspng.com/thumbs/no-image-icon/no-image-icon-6.png" alt='Sem produtos relacionados a ele.' />
                    </section>
                ) : (
                    <CardGeral
                        filtro={null}
                        card={produtos}
                        ClassNameCard={style.corpo_card}
                        ClassImg={style.img}
                        enableOverflow={false}
                        Desc={style.desc}
                    />
                )}
            </Container>
        </div>

    )
}

export default Visualizar