import React from 'react'
import { useEffect, useState } from 'react'

const Notficacao = () => {
    const [resultados, setresultados] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/insumos/alerta')
            .then(res => {
                if (res.status === 204) {
                    return null;
                }
                else {
                    return res.json();
                }
            })
            .then(data => {
                console.log("Resultado recebido:", data)
                if (data) {
                    setresultados(data);
                }
            })
            .catch(error => console.log(error));

    }, [])

    return (
        <div>
            {resultados.length <= 10 && (
                <>
                    <h1>ATENÇÃO, INSUMOS COM POUCO ESTOQUE:</h1>
                    <ul>
                        {resultados.map((produto) => (
                            <li key={produto.id_insumos}>
                                <p>{produto.nome_insumos} {produto.quantidade_insumos}</p>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    )
}

export default Notficacao