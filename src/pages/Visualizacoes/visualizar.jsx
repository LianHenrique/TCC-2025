import { useState, useEffect } from 'react'
import Navbar from '../../components/NavBar/NavBar'
import { useParams } from 'react-router-dom'
import { Col, Form, Row, Container } from 'react-bootstrap'
import Button from 'react-bootstrap/Button';

const Visualizar = () => {
    const { id } = useParams();
    const [insumos, setInsumos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [novaQuantidade, setNovaQuantidade] = useState('');
    const [novoNome, setNovoNome] = useState('');
    const [novaUrl, setNovaUrl] = useState('');
    const [novoPreco, setNovoPreco] = useState('');

    useEffect(() => {
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
                const insumo = Array.isArray(data) ? data[0] : data;
                const imagemValida = insumo.imagem_url && insumo.imagem_url.trim() !== ''
                    ? `${insumo.imagem_url}?t=${new Date().getTime()}`
                    : 'https://www.valuehost.com.br/blog/wp-content/uploads/2022/01/post_thumbnail-77d8f2a95f2f41b5863f3fba5a261d7e.jpeg.webp';

                const insumosFormatado = {
                    nome: insumo.nome_insumos || 'Sem nome',
                    link: imagemValida,
                    Quantidade: insumo.quantidade_insumos,
                    Unidade: insumo.unidade_medida,
                    Preco: insumo.valor_insumos,
                    descricao: [
                        { texto: `Categoria: ${insumo.categoria ?? 'N/A'}` },
                        { texto: `Data de entrada: ${insumo.data_cadastro ?? 'N/A'}` },
                        { texto: `Descrição: ${insumo.descricao_item ?? 'N/A'}` }
                    ]
                };

                setInsumos([insumosFormatado]);
                setNovaQuantidade(insumo.quantidade_insumos);
                setLoading(false);
                setError(null);
            })
            .catch(error => {
                setInsumos([]);
                setLoading(false);
                setError(error.message);
            });
    }, [id]);

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
                    imagem_url: novaUrl || insumos[0].link,
                    Preco: novoPreco || insumos[0].Preco
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Erro ao atualizar insumo');
            }

            alert('Insumo atualizado com sucesso!');
        } catch (error) {
            alert(`Erro: ${error.message}`);
        }
    };

    const handleDelete = (id) => {
        fetch(`http://localhost:3000/InsumosDelete/${id}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro na requisição');
                }
                window.location.reload();
            })
            .catch(() => {
                alert('Erro ao deletar o insumo');
            });
    };

    if (loading) return <p>Carregando produto...</p>;
    if (error) return <p>{error}</p>;

    return (
        <>
            <Navbar />
            <Container>
                <Form
                    style={{
                        display: 'flex',
                        justifyContent: "center",
                        margin: "100px auto",
                        gap: "20px"
                    }}>
                    <Row style={{ width: "100%" }}>
                        {/* Coluna da imagem */}
                        <Col md={6} className="text-center" style={{ width: "400px" }}>
                            <img
                                className="rounded"
                                src={insumos[0]?.link}
                                alt="Imagem do insumo"
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    maxWidth: '400px',
                                    objectFit: 'contain'
                                }}
                            />
                        </Col>
                        {/* Coluna dos campos */}
                        <Col md={6}>
                            <p className="h5 mb-5">Modifique o registro aqui:</p>
                            {/* Alterar o nome */}
                            <Form.Group className="mb-3">
                                <Form.Label>Alterar o nome</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="nome"
                                    style={{ height: "50px" }}
                                    placeholder={`Nome atual: ${insumos[0]?.nome}`}
                                    value={novoNome}
                                    onChange={(e) => setNovoNome(e.target.value)}
                                />
                            </Form.Group>
                            {/* Quantidade */}
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    Quantidade disponível: {insumos[0]?.Quantidade} {insumos[0]?.Unidade}
                                </Form.Label>
                                <Form.Control
                                    type="number"
                                    name="quantidade"
                                    style={{ height: "50px" }}
                                    placeholder={`Quantidade atual: ${novaQuantidade}`}
                                    value={novaQuantidade}
                                    onChange={(e) => setNovaQuantidade(e.target.value)}
                                />
                            </Form.Group>
                            {/* PREÇO DO INSUMO */}
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    Preço atual: {insumos[0]?.Preco}
                                </Form.Label>
                                <Form.Control
                                    type="number"
                                    name="Preco"
                                    style={{ height: "50px" }}
                                    placeholder={`Alterar preço: ${insumos[0]?.Preco}`}
                                    value={novoPreco}
                                    onChange={(e) => setNovoPreco(e.target.value)}
                                />
                            </Form.Group>
                            {/* URL da imagem */}
                            <Form.Group className="mb-3">
                                <Form.Label>Alterar imagem</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="url"
                                    value={novaUrl}
                                    style={{ height: "50px" }}
                                    placeholder={`Imagem atual: ${insumos[0]?.link}`}
                                    onChange={(e) => setNovaUrl(e.target.value)}
                                />
                            </Form.Group>
                            <Button variant="primary" onClick={handleInsert}>
                                Alterar
                            </Button>{' '}
                            <Button variant="danger" onClick={() => {
                                const confirmar = window.confirm('Deseja deletar o insumo?');
                                if (confirmar) {
                                    handleDelete(id);
                                }
                            }}>
                                Deletar
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Container>
        </>
    );
};

export default Visualizar;