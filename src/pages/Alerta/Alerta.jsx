import React, { useState, useEffect } from 'react'
import NavBar from '../../components/NavBar/NavBar'
import { Container, Card } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
// import 'bootstrap-icons/font/bootstrap-icons.css';

const Alerta = () => {
    const [insumos, setInsumos] = useState([])
    useEffect(() => {
        fetch('http://localhost:3000/insumos/alerta')
            .then(res => res.json())
            .then(data => {
                if (!Array.isArray(data)) {
                    console.warn('Resposta inesperada:', data)
                    setInsumos([])
                    return
                }

                const InsumosFormatados = data.map(func => ({
                    id: func.id_insumos,
                    quantidade: func.quantidade_insumos,
                    nome: func.nome_insumos,
                    link: func.imagem_url || 'https://via.placeholder.com/150'
                }))
                setInsumos(InsumosFormatados)
            })
            .catch(error => console.error('Erro ao buscar insumo', error))
    }, [])

    return (
        <div>
            <NavBar />
            <section style={{ marginTop: '20vh' }}>
                <Container>
                    <p className='h1 alert alert-danger w-25' style={{ fontSize: '2vh' }}>
                        Insumos para serem repostos
                    </p>
                    <section style={{
                        display: 'flex',
                        position: 'relative',
                        top: '3.8em',
                        width: '3vw',
                        right: '-60vw'
                    }}>
                        {/* <i class="bi bi-palette-fill text-success p" style={{
                        }}>
                            Baixa prioridade</i> */}
                    </section>
                    <Card.Body key={insumos.id}
                        style={{
                            boxShadow: '5px 5px 9px rgba(0, 0, 0, 0.3)',
                            width: '55vw',
                            position: 'relative',
                        //     left: '10vw'
                        }}
                    >
                        {insumos.map(insumo => {
                            let color = ''
                            if (insumo.quantidade < 10) {
                                color = 'rgba(246, 148, 148, 1)'
                            } else if (insumo.quantidade > 15) {
                                color = 'rgb(189, 251, 158)'
                            } else if (insumo.quantidade < 15) {
                                color = 'rgb(251, 255, 176)'
                            }
                            else {
                                color = 'white'
                            }

                            return (
                                <div key={insumo.id} style={{
                                    marginLeft: '1vw'
                                }}>
                                    <img
                                        src={insumo.link}
                                        alt={insumo.nome}
                                        className='img-fluid'
                                        style={{
                                            position: 'relative',
                                            top: '2vh',
                                            height: '60px',
                                            borderRadius: '100%',
                                            width: '60px',
                                            boxShadow: '1px 2px 5px rgba(0, 0, 0, 0.3)',
                                            backgroundColor: color
                                        }}
                                    />
                                    <section style={{
                                        // border: 'solid 5px blue',
                                        backgroundColor: color,
                                        position: 'relative',
                                        top: '-4.2vh',
                                        width: '30vw',
                                        left: '5vw',
                                        height: '3.5vh'
                                    }}>
                                        <section style={{
                                            display: 'flex',
                                            gap: '20px'
                                        }}>
                                            <p class='p'>Nome: {insumo.nome}</p>
                                            <p>Quantidade: {insumo.quantidade}</p>
                                        </section>

                                        <Button style={{
                                            display: 'flex',
                                            position: 'relative',
                                            left: '32vw',
                                            // top: '-100%'
                                            top: '-2.5em',
                                        }}>
                                            Adicionar
                                        </Button>
                                    </section>
                                </div>
                            )
                        })}
                    </Card.Body>
                </Container>
            </section>
        </div>

    )
}

export default Alerta