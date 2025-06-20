import React, { useEffect, useState } from 'react';
import NavBar from '../../components/NavBar/NavBar';
import { Container, Card, Dropdown } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router';

const DataVencimento = () => {
    const [insumos, setInsumos] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:3000/alertas/vencimentos')
            .then(res => res.json())
            .then(data => {
                const ordenados = data.sort((a, b) =>
                    new Date(a.data_vencimento) - new Date(b.data_vencimento)
                );
                setInsumos(ordenados);
            })
            .catch(error => console.error('Erro ao buscar vencimentos:', error));
    }, []);

    const calcularDiasRestantes = (dataVenc) => {
        const hoje = new Date();
        const vencimento = new Date(dataVenc);
        return Math.floor((vencimento - hoje) / (1000 * 60 * 60 * 24));
    };

    const getCorDeFundo = (dias) => {
        if (dias <= 7) return '#ef5350'; // vermelho forte
        if (dias <= 90) return '#fff3cd'; // amarelo claro
        return '#d4edda'; // verde claro

        /*
      Lógica das cores de fundo dos cartões:
    
      - Vermelho forte (#ef5350): vencimento em até 7 dias
      - Amarelo claro (#fff3cd): vencimento entre 8 e 90 dias
      - Verde claro (#d4edda): vencimento acima de 90 dias
    
      Quando o fundo for vermelho, o texto e o botão ficam brancos para melhor contraste.
    */


    };

    return (
        <div>
            <NavBar />
            <Container style={{ marginTop: '100px' }}>
                <h2 className="mb-4">Alertas de Vencimento dos Insumos</h2>
                <Button
                    variant="primary"
                    className="text-white mb-4"
                    onClick={() => navigate('/alertas')}
                >
                    Alertas De Quantidade
                </Button>

                {insumos.map((insumo) => {
                    const dias = calcularDiasRestantes(insumo.data_vencimento);
                    const bgColor = getCorDeFundo(dias);
                    const textoBranco = bgColor === '#ef5350';

                    return (
                        <Card
                            key={insumo.id_insumos}
                            className="mb-3 shadow-sm"
                            style={{
                                backgroundColor: bgColor,
                                color: textoBranco ? 'white' : 'black',
                                padding: '15px',
                                borderRadius: '10px',
                            }}
                        >
                            <div className="d-flex align-items-center">
                                <img
                                    src={insumo.imagem_url}
                                    alt={insumo.nome_insumos}
                                    style={{
                                        width: '100px',
                                        height: '100px',
                                        objectFit: 'contain',
                                        borderRadius: '10px',
                                        marginRight: '20px',
                                        backgroundColor: textoBranco ? 'white' : 'transparent'
                                    }}
                                />
                                <div style={{ flexGrow: 1 }}>
                                    <h5>{insumo.nome_insumos}</h5>
                                    <p className="mb-0">
                                        Vencimento: {new Date(insumo.data_vencimento).toLocaleDateString()}
                                    </p>
                                </div>

                                {insumo.fornecedores?.length > 0 && (
                                    <Dropdown>
                                        <Dropdown.Toggle variant={textoBranco ? 'light' : 'secondary'} size="sm">
                                            Ver Fornecedores
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            {insumo.fornecedores.map((fornecedor, idx) => (
                                                <Dropdown.Item key={idx}>
                                                    <strong>{fornecedor.nome}</strong><br />
                                                    {fornecedor.telefone}
                                                </Dropdown.Item>
                                            ))}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                )}
                            </div>
                        </Card>
                    );
                })}
            </Container>
        </div>
    );
};

export default DataVencimento;
