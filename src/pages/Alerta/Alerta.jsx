import React, { useState, useEffect } from 'react'
import NavBar from '../../components/NavBar/NavBar'
import { Container, Card } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
// import 'bootstrap-icons/font/bootstrap-icons.css';

// Componente principal da página de alerta de insumos
const Alerta = () => {
    // Estado para armazenar a lista de insumos que precisam ser repostos
    const [insumos, setInsumos] = useState([])

    // useEffect para buscar os insumos do backend ao montar o componente
    useEffect(() => {
        // Faz a requisição para o backend
        fetch('http://localhost:3000/insumos/alerta')
            .then(res => res.json())
            .then(data => {
                // Se a resposta não for um array, mostra aviso e limpa insumos
                if (!Array.isArray(data)) {
                    console.warn('Resposta inesperada:', data)
                    setInsumos([])
                    return
                }

                // Formata os dados recebidos para o formato usado no componente
                const InsumosFormatados = data.map(func => ({
                    id: func.id_insumos,
                    quantidade: func.quantidade_insumos,
                    nome: func.nome_insumos,
                    link: func.imagem_url || 'https://via.placeholder.com/150'
                }))
                setInsumos(InsumosFormatados)
            })
            .catch(error => console.error('Erro ao buscar insumo', error))
    }, []) // Executa apenas uma vez ao montar

    return (
        <div>
            {/* Barra de navegação */}
            <NavBar />
            <section style={{ marginTop: '20vh' }}>
                <Container>
                    {/* Título do alerta */}
                    <p className='h1 alert alert-danger w-25' style={{ fontSize: '2vh' }}>
                        Insumos para serem repostos
                    </p>
                    {/* Seção para ícones ou legendas (comentada) */}
                    <section style={{
                        display: 'flex',
                        position: 'relative',
                        top: '3.8em',
                        width: '3vw',
                        right: '-60vw'
                    }}>
                        {/* <i class="bi bi-palette-fill text-success p">Baixa prioridade</i> */}
                    </section>
                    {/* Card que contém a lista de insumos */}
                    <Card.Body
                        // key={insumos.id} // Não precisa de key aqui, pois o Card.Body não é repetido
                        style={{
                            boxShadow: '5px 5px 9px rgba(0, 0, 0, 0.3)',
                            width: '55vw',
                            position: 'relative',
                            // left: '10vw'
                        }}
                    >
                        {/* Mapeia cada insumo para exibir na tela */}
                        {insumos.map(insumo => {
                            // Define a cor de fundo de acordo com a quantidade
                            let color = ''
                            if (insumo.quantidade < 10) {
                                color = 'rgba(246, 148, 148, 1)' // Vermelho claro: crítico
                            } else if (insumo.quantidade > 15) {
                                color = 'rgb(189, 251, 158)' // Verde: tranquilo
                            } else if (insumo.quantidade <= 15) {
                                color = 'rgb(251, 255, 176)' // Amarelo: atenção
                            }
                            else {
                                color = 'white'
                            }

                            // Renderiza cada insumo
                            return (
                                <div key={insumo.id} style={{
                                    marginLeft: '1vw'
                                }}>
                                    {/* Imagem do insumo */}
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
                                    {/* Seção com informações e botão */}
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
                                            {/* Nome e quantidade do insumo */}
                                            <p className='p'>Nome: {insumo.nome}</p>
                                            <p>Quantidade: {insumo.quantidade}</p>
                                        </section>

                                        {/* Botão para adicionar mais insumos no estoque */}
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