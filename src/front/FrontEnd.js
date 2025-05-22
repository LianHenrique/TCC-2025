import React, {useEffect, useState} from 'react';

// UseState cria variáveis que mudam com o tempo.
// UseEffect executa algo enquanto a página carrega

import CardGeral from '../components/Cards/CardGeral';

function App(){

    const [funcionarios, setFuncionarios] = useState([])

    // O useEffect vai rdar uma vez, quando o component app estiver sendo contruído.
    useEffect(() => {
        fetch('http://localhost:3000/funcionarios')
        .then(response => response.json()) // converto a resposta p/json 

        .then(data => {
            setFuncionarios(data)
        })
        .catch(error => console.log("Erro ao buscar funcionários:", error))
    }, [])

    return(
        <div className='CardFuncionario'>
            <CardGeral filtro="funcionarios" card={funcionarios}/>
        </div>
    )

}
export default App