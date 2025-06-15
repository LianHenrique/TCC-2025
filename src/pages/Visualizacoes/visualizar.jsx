import { useState, useEffect } from 'react'
import Navbar from '../../components/NavBar/NavBar'
import { useParams } from 'react-router-dom'
import { Col, Form } from 'react-bootstrap'
import Button from 'react-bootstrap/Button';

// import Button from "react"

// tem que pegar o id da tela de cardápio, props.
const Visualizar = () => {

    const { id } = useParams();
    const [insumos, setInsumos] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [novaQuantidade, setNovaQuantidade] = useState('');
    const [novoNome, setNovoNome] = useState('')
    const [novaUrl, setNovaUrl] = useState('')
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
                setNovaQuantidade(insumos.quantidade_insumos)
                setLoading(false);
                setError(null);
            })
            .catch(error => {
                console.log("Erro ao buscar insumo", error);
                setInsumos([]);
                setLoading(false);
                setError(error.message);
            });
    }, [id]);


    // Consultar na linha 231 do BackEnd
    const handleInsert = async () => {
        try {
            const response = await fetch(`http://localhost:3000/insumos_tudo_POST/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    quantidade_insumos: novaQuantidade !== '' ? novaQuantidade : insumos[0].Quantidade,
                    nome_insumos: novoNome || insumos[0].nome,
                    imagem_url: novaUrl || insumos[0].link
                })
            });

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao atualizar insumo');
            }

            alert('Insumo atualizado com sucesso!')
        } catch (error) {
            alert(`Erro: ${error.message}`)
        }
    }



    if (loading) return <p>Carregando produto...</p>
    if (error) return <p>{error}</p>

    return (
        <>
            <Navbar />
            <Form
                style={{
                    display: 'flex',
                    justifyContent: "center",
                    margin: "200px auto",
                    gap: "20px"
                }}>

                {/* Coluna da imagem - AGORA À ESQUERDA */}
                <Col md={6} 
                className="text-center"
                style={{
                    width: "400px"
                }}>
                    <img
                        className="rounded"
                        src={insumos[0].link}
                        alt="Imagem do insumo"
                        style={{
                            width: '100%',
                            height: 'auto',
                            maxWidth: '400px',
                            objectFit: 'contain'
                        }}
                    />
                </Col>

                {/* Coluna dos campos - À DIREITA */}
                <Col md={6}>
                    <p className="h5 mb-5">Modifique o registro aqui:</p>
                    {/* Alterar o nome */}
                    <Form.Group className="mb-3">
                        <Form.Label>Alterar o nome</Form.Label>
                        <Form.Control
                            type="text"
                            name="nome"
                            style={{
                                height: "50px"
                            }}
                            placeholder={`Nome atual: ${insumos[0].nome}`}
                            value={novoNome}
                            onChange={(e) => setNovoNome(e.target.value)}
                        />
                    </Form.Group>

                    {/* Quantidade */}
                    <Form.Group className="mb-3">
                        <Form.Label>
                            Quantidade disponível: {insumos[0].Quantidade} {insumos[0].Unidade}
                        </Form.Label>
                        <Form.Control
                            type="number"
                            name="quantidade"
                            style={{
                                height: "50px"
                            }}
                            placeholder={`Quantidade atual: ${novaQuantidade}`}
                            onChange={(e) => setNovaQuantidade(e.target.value)}
                        />
                    </Form.Group>

                    {/* URL da imagem */}
                    <Form.Group className="mb-3">
                        <Form.Label>Alterar imagem</Form.Label>
                        <Form.Control
                            type="text"
                            name="url"
                            value={novaUrl}
                            style={{
                                height: "50px"
                            }}
                            placeholder={`Imagem atual: ${insumos[0].link}`}
                            onChange={(e) => setNovaUrl(e.target.value)}
                        />
                    </Form.Group>

                    <Button variant="primary" onClick={handleInsert}>
                        Confirmar
                    </Button>
                </Col>
            </Form>
        </>
    )
}

export default Visualizar
