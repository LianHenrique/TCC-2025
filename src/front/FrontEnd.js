import React, {useEffect, useState} from 'react';

// UseState cria variáveis que mudam com o tempo.
// UseEffect executa algo enquanto a página carrega

import CardGeral from '../components/Cards/CardGeral';

function App(){

    const [funcionarios, setFuncionarios] = useState([])
    const [produtos, setProdutos] = useState([])

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
            setProdutos(data)
        })
        .catch(error => console.log("Erro ao buscar produto"))
    , []})

    return(
        <div className='CardFuncionario'>
            <CardGeral filtro="funcionarios" card={funcionarios}/>
            <CardGeral filtro="produtos" card={produtos}/>
        </div>
    )

}
export default App