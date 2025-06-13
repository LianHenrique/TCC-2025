import React, { useState, useEffect } from 'react'
import Navbar from '../../components/NavBar/NavBar'
import CardGeral from '../../components/Cards/CardGeral'
import { Container } from 'react-bootstrap'
import style from './visualizar.module.css'
import { useParams } from 'react-router-dom'
import { Row, Col, Form } from 'react-bootstrap'

// tem que pegar o id da tela de cardápio, props.
const Visualizar = () => {

    const { id } = useParams();
    const [insumos, setInsumos] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    console.log('params:', useParams)

    useEffect(() => {
        console.log(`UseEffect disparou. id: ${id}`);

        if (!id) {
            setInsumos([]);
            setLoading(false);
            return;
        }

        fetch(`http://localhost:3000/insumos_tudo/${id}`)
            .then(response => {
                if (!response.ok) throw new Error('Produto não encontrado');
                return response.json();
            })
            .then(data => {
                console.log('Data bruto recebido:', data);

                // Corrige se o backend retornou apenas um objeto
                const insumos = Array.isArray(data) ? data[0] : data;

                const imagemValida = insumos.imagem_url && insumos.imagem_url.trim() !== ''
                    ? `${insumos.imagem_url}?t=${new Date().getTime()}`
                    : 'https://www.valuehost.com.br/blog/wp-content/uploads/2022/01/post_thumbnail-77d8f2a95f2f41b5863f3fba5a261d7e.jpeg.webp';

                const insumosFormatado = {
                    nome: insumos.nome_insumos || 'Sem nome',
                    link: imagemValida,
                    Quantidade: insumos.quantidade_insumos,
                    Unidade: insumos.unidade_medida,
                    descricao: [
                        { texto: `Categoria: ${insumos.categoria ?? 'N/A'}` },

                        { texto: `Data de entrada: ${insumos.data_cadastro ?? 'N/A'}` },

                        { texto: `Descrição: ${insumos.descricao_item ?? 'N/A'}` }
                    ]
                };

                console.log('Dados recebidos formatados:', insumosFormatado);
                setInsumos([insumosFormatado]); // coloca em array porque CardGeral espera um array
                setLoading(false);
                setError(null);
            })
            .catch(error => {
                console.log("Erro ao buscar insumo", error);
                setProdutos([]);
                setLoading(false);
                setError(error.message);
            });
    }, [id]);


    const handleInsert = async () =>{
        // HANDLE INSERT NÃO DEU CERTO, PESQUISAR NA TELA DE VISUALIZAR ESTOQUE (INSUMOS)
        const { name, value } = e.target;
        setInsumos({ ...insumos, [name]: value });
    }



    if (loading) return <p>Carregando produto...</p>
    if (error) return <p>{error}</p>

    return (
        <>
            <Navbar />
            <Container>
                <Form style={{ marginTop: '21vh', marginLeft: '8vw' }}>
                    <Row className="justify-content-start" style={{display: 'flex', flexDirection:'row'}}>
                        <Col xs='auto'>
                            <Form.Group style={{ display: 'flex', flexDirection: 'column' }}>
                                <Form.Label className='h5 flex-start'>{insumos[0].nome} <i class="bi bi-pencil-square"></i></Form.Label>
                                <img src={insumos[0].link} alt='imagem representativa do insumo' className='img-fluid rounded' style={{
                                    maxHeight: '50vh'
                                }} />
                            </Form.Group>

                                <Form.Group style={{ display: 'flex', flexDirection: 'column' }}>
                                    <Form.Label className='flex-start'>  <p>Quantidade desponível:{insumos[0].Quantidade}</p> <p>{insumos[0].Unidade}</p> <i class="bi bi-pencil-square"></i></Form.Label>
                                    <p>Alterar quantidade</p>
                                    <Form.Control
                                    type="number"
                                    name="quantidade"
                                    placeholder={`Atualmente: ${insumos[0].Quantidade}`}
                                    value={insumos[0].quantidade_insumos || ''}
                                    onChange={handleInsert}
                                    />
                                </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </Container>
        </>
    )
}

export default Visualizar