
import React, { useState, useEffect } from 'react'
import NavBar from '../../components/NavBar/NavBar'
import { Container, Card } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import { useNavigate } from 'react-router-dom'
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


    const navigate = useNavigate()
    const handleNavigate = (id) => {
        navigate(`/visualizar/${id}`)
    }
    return (
        <div>
            {/* Barra de navegação */}
            <NavBar />
            <Container
                style={{
                    marginTop: "100px"
                }}>
                {/* Título do alerta */}
                <h1 style={{ marginBottom: "50px"}}>Insumos para serem repostos</h1>
                {/* Seção para ícones ou legendas (comentada) */}
                <section style={{
                    display: 'flex',
                    position: 'relative'
                }}>
                    {/* <i class="bi bi-palette-fill text-success p">Baixa prioridade</i> */}
                </section>
                {/* Card que contém a lista de insumos */}
                <Card.Body className='d-flex flex-wrap gap-4 justify-content-start'>
                    {/* Mapeia cada insumo para exibir na tela */}
                    {insumos.map(insumo => {
                        // Define a cor de fundo de acordo com a quantidade
                        let colort = ''
                        if (insumo.quantidade < 10) {
                            colort = 'rgb(255, 0, 0)' // Vermelho claro: crítico
                        } else if (insumo.quantidade > 15) {
                            colort = 'rgb(0, 255, 0)' // Verde: tranquilo
                        } else if (insumo.quantidade <= 15) {
                            colort = 'rgb(255, 255, 0)' // Amarelo: atenção
                        }
                        else {
                            colort = 'white'
                        }

                        // Renderiza cada insumo
                        return (
                            <div key={insumo.id}
                                className='shadow rounded d-flex gap-3 align-items-center'
                                style={{
                                    width: '100%',
                                    maxWidth: '625px',
                                    padding: '10px',
                                    backgroundColor: 'white'
                                }}
                            >
                                {/* Imagem do insumo */}
                                <img
                                    src={insumo.link}
                                    alt={insumo.nome}
                                    className='img-fluid rounded-5'
                                    style={{
                                        width: '100px',
                                        height: '100px',
                                        objectFit: 'contain', // ou 'cover' se quiser cortar a imagem
                                        backgroundColor: '#f8f9fa' // opcional: fundo neutro
                                    }}
                                />
                                {/* Seção com informações e botão */}

                                <div
                                    className='d-flex justify-content-between align-items-center'
                                    style={{ width: '100%' }}
                                >
                                    {/* Conteúdo principal à esquerda */}
                                    <div style={{ flexGrow: 1 }}>
                                        <div
                                            style={{
                                                display: 'flex',
                                                gap: '20px',
                                                fontSize: '20px',
                                                flexWrap: 'wrap',
                                                color: "black"
                                            }}
                                        >
                                            <p>Nome: {insumo.nome}</p>
                                            <p>Quantidade: {insumo.quantidade}</p>
                                        </div>

                                        <Button onClick={() => handleNavigate(insumo.id)}>Adicionar</Button>
                                    </div>

                                    {/* Ícone de alerta à direita */}
                                    <h2
                                        className='rounded-5 d-flex justify-content-center align-items-center'
                                        style={{
                                            backgroundColor: colort,
                                            border: '1px solid black',
                                            minWidth: '40px',
                                            minHeight: '40px',
                                            textAlign: 'center',
                                            marginLeft: '20px',
                                            color: "black"
                                        }}
                                    >
                                        !
                                    </h2>
                                </div>
                            </div>
                        )
                    })}
                </Card.Body>
            </Container>
        </div >
    )
}

export default Alerta
