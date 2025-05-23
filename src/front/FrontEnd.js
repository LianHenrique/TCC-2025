import React, { useEffect, useState } from 'react';

// UseState cria variáveis que mudam com o tempo.
// UseEffect executa algo enquanto a página carrega

import CardGeral from '../components/Cards/CardGeral';

function App() {

    const [funcionarios, setFuncionarios] = useState([])
    const [produtos, setProdutos] = useState([])
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
                const produtosFormatados = Array.isArray(data) ? data.map(produto => ({
                    nome: produto.nome_produto || 'Sem nome',
                    link: 'https://via.placeholder.com/150',
                    descricao: [
                        { texto: `Quantidade ${produto.QTD_produto}` },
                        { texto: `Entrada ${new Date(produto.QTD_entrada_produto).toLocaleDateString()}` },
                        { texto: `Vencimento: ${new Date(produto.data_vencimento_prod).toLocaleDateString()}` }
                    ]
                })) : []

              setProdutos(produtosFormatados);
            })
            .catch(error => console.log("Erro ao buscar produto", error))
    }, [])

    
    return (
        <div className='CardFuncionario'>
            <CardGeral filtro="funcionarios" card={funcionarios} />

            {loading ? (
                <p>Carrefando produto...</p>
            ) : !produtos.length ? (
                <p>Nenhum produto encontrado</p>
            ) : (
                <CardGeral filtro="produtos" card={produtos} />
            )}
        </div>
    )

}
export default App