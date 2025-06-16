import { useState, useEffect } from 'react';
import '../Style/login.css';
import NavBar from '../../components/NavBar/NavBar';
import { Button, Container, FloatingLabel, Form } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

const Visualizar = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [nomeinsumos, setNomeinsumos] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;

        fetch(`http://localhost:3000/insumos_tudo/${id}`)
            .then((res) => {
                if (!res.ok) throw new Error('Insumo não encontrado.');
                return res.json();
            })
            .then((data) => {
                const insumoData = Array.isArray(data) ? data[0] : data;

                setNomeinsumos(insumoData.nome_insumos || '');
                setQuantidade(insumoData.quantidade_insumos?.toString() || '');
                setUrl(insumoData.imagem_url || '');
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (nomeinsumos.trim() === '' || quantidade.trim() === '' || url.trim() === '') {
            alert('Todos os campos são obrigatórios.');
            return;
        }

        if (isNaN(Number(quantidade)) || Number(quantidade) < 0) {
            alert('Quantidade deve ser um número válido e maior ou igual a zero.');
            return;
        }

        const dados = {
            nome_insumos: nomeinsumos,
            quantidade_insumos: Number(quantidade),
            imagem_url: url
        };

        try {
            const res = await fetch(`http://localhost:3000/insumos_tudo_POST/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados),
            });

            if (res.ok) {
                alert('Insumo atualizado com sucesso!');
                navigate('/estoque');
            } else {
                alert('Erro ao atualizar o insumo.');
            }
        } catch (error) {
            alert('Erro de rede ou servidor.');
            console.error(error);
        }
    };

    if (loading) return <p>Carregando insumo...</p>;
    if (error) return <p>Erro: {error}</p>;

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

                    <FloatingLabel controlId="nomeinsumos" label="Nome" className="mb-3">
                        <Form.Control
                            type="text"
                            placeholder="Nome"
                            value={nomeinsumos}
                            onChange={(e) => setNomeinsumos(e.target.value)}
                            className="rounded-5 shadow"
                            style={{ border: 'none' }}
                            required
                        />
                    </FloatingLabel>

                    <FloatingLabel controlId="quantidade" label="Quantidade" className="mb-3">
                        <Form.Control
                            type="number"
                            placeholder="Quantidade"
                            value={quantidade}
                            onChange={(e) => setQuantidade(e.target.value)}
                            className="rounded-5 shadow"
                            style={{ border: 'none' }}
                            min="0"
                            required
                        />
                    </FloatingLabel>

                    {url && (
                        <div className="text-center mb-4">
                            <img
                                src={url}
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

                    <FloatingLabel controlId="url" label="URL da Imagem" className="mb-3">
                        <Form.Control
                            type="text"
                            placeholder="URL da imagem"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="rounded-5 shadow"
                            style={{ border: 'none' }}
                            required
                        />
                    </FloatingLabel>


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