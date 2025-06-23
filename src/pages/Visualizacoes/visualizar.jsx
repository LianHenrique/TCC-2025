import { useState, useEffect } from 'react';
import '../Style/login.css';
import NavBar from '../../components/NavBar/NavBar';
import { Button, Container, FloatingLabel, Form, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

const Visualizar = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [nome, setNome] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [filtro, setFiltro] = useState('');
    const [url, setUrl] = useState('');
    const [validade, setValidade] = useState('');
    const [preco, setPreco] = useState('');
    const [imagemAtual, setImagemAtual] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;

        console.log('Dados enviados:', {
            nome_insumos: nome,
            quantidade_insumos: quantidade,
            categoria: filtro,
            imagem_url: url,
            valor_insumos: preco,
            data_vencimento: validade
        });

        fetch(`http://localhost:3000/insumos_tudo/${id}`)
            .then(res => {
                if (!res.ok) throw new Error('Produto não encontrado');
                return res.json();
            })
            .then(data => {
                const insumo = Array.isArray(data) ? data[0] : data;
                setNome(insumo.nome_insumos);
                setQuantidade(insumo.quantidade_insumos);
                setPreco(insumo.valor_insumos);
                setUrl(insumo.imagem_url);
                setImagemAtual(insumo.imagem_url);
                setFiltro(insumo.categoria);

                const dataFormatada = insumo.data_vencimento
                    ? new Date(insumo.data_vencimento).toISOString().split('T')[0]
                    : '';
                setValidade(dataFormatada);

                setLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });
    }, [id]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:3000/insumos_tudo_POST/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nome_insumos: nome,
                    quantidade_insumos: quantidade,
                    categoria: filtro,
                    imagem_url: url,
                    valor_insumos: preco,
                    data_vencimento: validade // <- Enviando validade no PUT
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Erro ao atualizar insumo');
            }

            alert('Insumo atualizado com sucesso!');
            navigate('/estoque');
        } catch (error) {
            alert(`Erro: ${error.message}`);
        }
    };

    if (loading) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" role="status" />
                <p className="mt-3">Carregando insumo...</p>
            </div>
        );
    }

    if (error) return <p className="text-danger text-center mt-5">{error}</p>;

    return (
        <div style={{ marginTop: '100px' }}>
            <NavBar />
            <Container style={{ maxWidth: '800px' }}>
                <Form
                    onSubmit={handleSubmit}
                    className="shadow"
                    style={{
                        padding: '30px',
                        borderRadius: '20px',
                        border: '1px solid blue',
                        marginBottom: '10px'
                    }}
                >
                    <h1 style={{ textAlign: 'center' }}>Editar Insumo</h1>

                    <FloatingLabel controlId="nome" label="Nome" className="mb-3">
                        <Form.Control
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            className="rounded-5 shadow"
                            required
                        />
                    </FloatingLabel>

                    <FloatingLabel controlId="quantidade" label="Quantidade" className="mb-3">
                        <Form.Control
                            type="number"
                            value={quantidade}
                            onChange={(e) => setQuantidade(e.target.value)}
                            className="rounded-5 shadow"
                            min="0"
                            required
                        />
                    </FloatingLabel>

                    <FloatingLabel controlId="preco" label="Preço (R$)" className="mb-3">
                        <Form.Control
                            type="number"
                            step="0.01"
                            value={preco}
                            onChange={(e) => setPreco(e.target.value)}
                            className="rounded-5 shadow"
                            required
                        />
                    </FloatingLabel>

                    <FloatingLabel controlId="validade" label="Validade" className="mb-3">
                        <Form.Control
                            type="date"
                            placeholder="Validade"
                            value={validade}
                            onChange={(e) => setValidade(e.target.value)}
                            className="rounded-5 shadow"
                            min={new Date().toISOString().split('T')[0]}
                            required
                        />
                    </FloatingLabel>

                    <FloatingLabel controlId="categoria" label="Categoria" className="mb-3">
                        <Form.Select
                            value={filtro}
                            onChange={(e) => setFiltro(e.target.value)}
                            className="rounded-5 shadow"
                            required
                        >
                            <option value="Carnes">Carnes</option>
                            <option value="Perecíveis">Perecíveis</option>
                            <option value="Molhos">Molhos</option>
                            <option value="Congelados">Congelados</option>
                        </Form.Select>
                    </FloatingLabel>

                    <FloatingLabel controlId="url" label="URL da Imagem" className="mb-3">
                        <Form.Control
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="rounded-5 shadow"
                            required
                        />
                    </FloatingLabel>

                    {url && (
                        <div className="text-center mb-4">
                            <img
                                src={imagemAtual}
                                alt="Imagem do insumo"
                                style={{
                                    maxWidth: '300px',
                                    width: '100%',
                                    height: 'auto',
                                    borderRadius: '10px',
                                    boxShadow: '0 0 10px rgba(0,0,0,0.2)'
                                }}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://www.valuehost.com.br/blog/wp-content/uploads/2022/01/post_thumbnail-77d8f2a95f2f41b5863f3fba5a261d7e.jpeg.webp';
                                }}
                            />
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="shadow mt-4"
                        style={{ padding: '15px', width: '100%', borderRadius: '30px' }}
                    >
                        Confirmar Alterações
                    </Button>

                    <Button
                        variant="outline-primary"
                        onClick={() => navigate('/estoque')}
                        className="shadow mt-2"
                        style={{ padding: '15px', width: '100%', borderRadius: '30px' }}
                    >
                        Cancelar
                    </Button>
                </Form>
            </Container>
        </div>
    );
};

export default Visualizar;
