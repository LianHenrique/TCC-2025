import React, { useEffect, useState } from 'react';

// UseState cria variáveis que mudam com o tempo.
// UseEffect executa algo enquanto a página carrega
import CardGeral from '../components/Cards/CardGeral';



function App() {

    const [funcionarios, setFuncionarios] = useState([])
    const [produtos, setProdutos] = useState([])
    const [cardapio, setCardapio] = useState([])
    const [loading, setLoading] = useState(true)


    // O useEffect vai rdar uma vez, quando o component app estiver sendo contruído.
    // Esse eseEffect é p/tela de funcionarios
    useEffect(() => {
        fetch('http://localhost:3000/funcionarios')
            .then(response => response.json()) // converto a resposta p/json 

            .then(data => {
                setFuncionarios(data)
            })
            .catch(error => console.log("Erro ao buscar funcionários:", error))
    }, [])



    // Esse é para a tela de visualizar
    useEffect(() => {
        fetch('http://localhost:3000/produto')
            .then(response => response.json())

            .then(data => {
                console.log("Dado bruto recebido:", data)
                // Se for indefinido, retorno um array vazio.

                if (!data) {
                    setProdutos([]);
                    setLoading(false);
                    setError('Não encontrado')
                    return;
                }

                const produtosFormatados = Array.isArray(data) ? data.map(produto => ({
                    nome: produto.nome_produto || 'Sem nome',
                    link: produto.imagem_url || 'https://via.placeholder.com/150',
                    descricao: [
                        { texto: `Quantidade ${produto.QTD_produto}` },
                        { texto: `Entrada ${new Date(produto.QTD_entrada_produto).toLocaleDateString()}` },
                        { texto: `Vencimento: ${new Date(produto.data_vencimento_prod).toLocaleDateString()}` },
                        { texto: `Descrição: ${produto.descricao_produto ?? 'N/A'}` }
                    ]
                })) : []
                console.log('Produtos formatados:', produtosFormatados)
                setProdutos(produtosFormatados);
            })
            .catch(error => console.log("Erro ao buscar produto", error))
    }, [])



    // Para a tela de cardapio
    useEffect(() => {
        fetch('http://localhost:3000/cardapio')
            .then(resposta => resposta.json())
            .then(data => {
                console.log("Cardápio bruto:", data)
                const cardapioFormatado = data.map(item => ({
                    nome: produto.nome_c_produto || 'Sem nome',
                    link: produto.link_prod_cardapio || 'https://via.placeholder.com/150',
                    descricao: [
                        { texto: `Nome: ${produto.nome_c_produto}` },
                        { texto: `Ingredientes: ${produto.descri_prod_insumos}` }
                    ],
                }))
                setCardapio(cardapioComFormatacao)
            })
            .catch(error => console.log("Erro ao buscar produto:", error))
    }, [])



    return (
        <div className='CardFuncionario'>
            <CardGeral filtro="funcionarios" card={funcionarios} />
            <CardGeral filtro="produtos" card={produtos} />
            <CardGeral filtro="cardapio" card={cardapio} />
        </div>
    )

}
export default App