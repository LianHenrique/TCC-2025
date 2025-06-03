import React from 'react'
import { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert';

const Notficacao = () => {
    const [resultados, setresultados] = useState([]);
    const [visivel, setVisivel] = useState(false);

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

            setTimeout(() => {
                setresultados([]);
            }, 4000);
    }, [])

    return (
        // <div> 
        //         <section>
        //             {resultados.length <= 10 && (
        //                 <>
        //                     <h1 class='h6'>ATENÇÃO, INSUMOS COM POUCA QUANTIDADE:</h1>
        //                     <ul>
        //                         {resultados.map((produto) => (
        //                             <li key={produto.id_insumos}>
        //                                 <p>{produto.nome_insumos} {produto.quantidade_insumos}</p>
        //                             </li>
        //                         ))}
        //                     </ul>
        //                 </>
        //             )}
        //         </section> 
        // </div>

        <Container style={{
            position: 'fixed',
            zIndex: 9999,
            width: '20vw',
            left: '80.5vw',
            top: '2em',
        }}>
            {resultados.length > 0 && (
                <>
                    <div>
                        <Alert variant="danger">
                            <Alert.Heading className='h6'>
                                Atenção: Estoque reduzindo!
                            </Alert.Heading>
                            <ul style={{ paddingLeft: '1rem' }}>
                                {resultados.map(produto => (
                                    <li key={produto.id_insumos}>
                                        {produto.nome_insumos} ({produto.quantidade_insumos})
                                    </li>
                                ))}
                            </ul>
                        </Alert>
                    </div>
                </>
            )}
        </Container>
    )
}

export default Notficacao