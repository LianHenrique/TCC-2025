import React, { useState, useEffect } from 'react'
import Navbar from '../../components/NavBar/NavBar'
import CardGeral from '../../components/Cards/CardGeral'
import { Container } from 'react-bootstrap'
import style from './visualizar.module.css'
import { useParams } from 'react-router'

// tem que pegar o id da tela de cardápio, props.
const Visualizar = () => {

    // Depois eu vou colocar o id como useparams() quando ela for integrada com a tela de estoque e funcionários, não fiz agora pq tava muito difícil pra fazer os testes.

    // Eu personalizei essse código apenas para testar se a requisição tá certa e fazer a bomba do css logo, por que ele não tá integrado nem com funcionário e nem com cardápio , pq fazer isso sem ter o código pronto é difícl demais. :/

    const { id } = useParams();
    const [produtos, setProdutos] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        console.log("Use effect disparou. id igual a:", id);

        if (!id) {
            setProdutos([]);
            setLoading(false);
            return;
        }

        fetch(`http://localhost:3000/produto/${id}`)
            .then(response => {
                if (!response.ok) throw new Error('Produto não encontrado');
                return response.json();
            })
            .then(data => {
                console.log('Data bruto recebido:', data);

                // Corrige se o backend retornou apenas um objeto
                const produto = Array.isArray(data) ? data[0] : data;

                const imagemValida = produto.imagem_url && produto.imagem_url.trim() !== ''
                    ? `${produto.imagem_url}?t=${new Date().getTime()}`
                    : 'https://www.valuehost.com.br/blog/wp-content/uploads/2022/01/post_thumbnail-77d8f2a95f2f41b5863f3fba5a261d7e.jpeg.webp';

                const produtoFormatado = {
                    nome: produto.nome_produto || 'Sem nome',
                    link: imagemValida,
                    descricao: [
                        { texto: `Quantidade: ${produto.QTD_produto ?? 'N/A'}` },
                        { texto: `Entrada: ${produto.QTD_entrada_produto ? new Date(produto.QTD_entrada_produto).toLocaleDateString() : 'N/A'}` },
                        { texto: `Vencimento: ${produto.data_vencimento_prod ? new Date(produto.data_vencimento_prod).toLocaleDateString() : 'N/A'}` },
                        { texto: `Descrição: ${produto.descricao_produto ?? 'N/A'}` }
                    ]
                };

                console.log('Dados recebidos formatados:', produtoFormatado);
                setProdutos([produtoFormatado]); // coloca em array porque CardGeral espera um array
                setLoading(false);
                setError(null);
            })
            .catch(error => {
                console.log("Erro ao buscar produto", error);
                setProdutos([]);
                setLoading(false);
                setError(error.message);
            });
    }, [id]);


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
                        ClassTitulo={style.titulo}
                    />
                )}
            </Container>
            <p className={style.title}>Descrição do insumo:</p>
        </div>

    )
}

export default Visualizar