import { useEffect, useState, useContext } from 'react';
import NavBar from '../../components/NavBar/NavBar';
import { Container, Card, Dropdown, Button, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../Contexts/ThemeContext';

const DataVencimento = () => {
    const [insumos, setInsumos] = useState([]);
    const { darkMode } = useContext(ThemeContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVencimentos = async () => {
            try {
                const response = await fetch('http://localhost:3000/alertas/vencimentos');

                if (!response.ok) {
                    // Se a resposta não for bem sucedida, tenta obter a mensagem de erro
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || `Erro ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();

                // Verifica se a resposta é um array
                if (!Array.isArray(data)) {
                    throw new Error('Resposta da API não é um array');
                }

                const tratados = data.map(insumo => {
                    let imagemUrl = insumo.imagem_url?.trim() || '';

                    if (imagemUrl.startsWith('http://') || imagemUrl.startsWith('https://')) {
                        return { ...insumo, imagem: imagemUrl };
                    }

                    if (imagemUrl.startsWith('/uploads/')) {
                        return { ...insumo, imagem: `http://localhost:3000${imagemUrl}` };
                    }

                    if (imagemUrl) {
                        return { ...insumo, imagem: `http://localhost:3000/uploads/${imagemUrl}` };
                    }

                    return { ...insumo, imagem: 'https://via.placeholder.com/100' };
                });

                const ordenados = tratados.sort((a, b) =>
                    new Date(a.data_vencimento) - new Date(b.data_vencimento)
                );

                setInsumos(ordenados);
                setError(null);
            } catch (err) {
                console.error('Erro ao buscar vencimentos:', err);
                setError(err.message || 'Erro ao carregar dados');
            } finally {
                setLoading(false);
            }
        };

        fetchVencimentos();
    }, []);

    const calcularDiasRestantes = (dataVenc) => {
        const hoje = new Date();
        const vencimento = new Date(dataVenc);
        return Math.ceil((vencimento - hoje) / (1000 * 60 * 60 * 24));
    };

    const getCor = (dias) => {
        if (dias <= 7) return { bg: '#f8d7da', border: '#f5c6cb', text: '#721c24' };
        if (dias <= 90) return { bg: '#fff3cd', border: '#ffeeba', text: '#856404' };
        return { bg: '#d4edda', border: '#c3e6cb', text: '#155724' };
    };

    if (loading) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Carregando...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <NavBar />
                <Container style={{ marginTop: '150px' }}>
                    <Alert variant="danger">
                        <h4>Erro ao carregar dados</h4>
                        <p>{error}</p>
                        <Button variant="outline-danger" onClick={() => window.location.reload()}>
                            Tentar novamente
                        </Button>
                    </Alert>
                </Container>
            </div>
        );
    }

    return (
        <div>
            <NavBar />
            <Container style={{ marginTop: '150px' }}>
                <h2 className="mb-4 text-center">⏳ Alertas de Vencimento dos Insumos</h2>

                <div className="d-flex justify-content-center mb-4">
                    <Button variant="outline-primary" onClick={() => navigate('/alertas')}>
                        <i className="bi bi-exclamation-circle me-2" />
                        Ver Alertas de Quantidade
                    </Button>
                </div>

                {insumos.length === 0 ? (
                    <Alert variant="info" className="text-center">
                        Nenhum insumo próximo ao vencimento encontrado
                    </Alert>
                ) : (
                    <Row className="g-4">
                        {insumos.map((insumo) => {
                            const dias = calcularDiasRestantes(insumo.data_vencimento);
                            const { bg, border, text } = getCor(dias);

                            return (
                                <Col key={insumo.id_insumos} xs={12} md={6}>
                                    <Card
                                        style={{
                                            backgroundColor: darkMode ? '#2e2e2e' : bg,
                                            borderColor: border,
                                            color: darkMode ? '#f1f1f1' : text,
                                            borderLeft: `6px solid ${text}`,
                                            padding: '15px',
                                            borderRadius: '12px',
                                            boxShadow: '0 0 6px rgba(0,0,0,0.1)',
                                        }}
                                    >
                                        <div className="d-flex align-items-center">
                                            <img
                                                src={insumo.imagem}
                                                alt={insumo.nome_insumos}
                                                style={{
                                                    width: '90px',
                                                    height: '90px',
                                                    objectFit: 'contain',
                                                    borderRadius: '8px',
                                                    marginRight: '20px',
                                                    backgroundColor: '#fff',
                                                    padding: '5px',
                                                }}
                                            />
                                            <div style={{ flex: 1 }}>
                                                <h5 className="mb-1">{insumo.nome_insumos}</h5>
                                                <p className="mb-1">
                                                    Vence em: <strong>{dias}</strong> dia(s)
                                                </p>
                                                <p className="mb-0">
                                                    Data: {new Date(insumo.data_vencimento).toLocaleDateString()}
                                                </p>
                                            </div>

                                            {insumo.fornecedores?.length > 0 && (
                                                <Dropdown>
                                                    <Dropdown.Toggle variant="light" size="sm">
                                                        Fornecedores
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        {insumo.fornecedores.map((fornecedor, idx) => (
                                                            <Dropdown.Item key={idx}>
                                                                <strong>{fornecedor.nome}</strong><br />
                                                                <span>Telefone: {fornecedor.telefone}</span><br />
                                                                {/* CORREÇÃO AQUI: troque email_fornecedor por email */}
                                                                <span>Email: {fornecedor.email || 'N/A'}</span>
                                                            </Dropdown.Item>
                                                        ))}
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            )}
                                        </div>
                                    </Card>
                                </Col>
                            );
                        })}
                    </Row>
                )}
            </Container>
        </div>
    );
};

export default DataVencimento;