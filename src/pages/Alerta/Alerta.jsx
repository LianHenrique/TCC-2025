import React, { useState, useEffect } from 'react';
import NavBar from '../../components/NavBar/NavBar';
import { Container, Card, Button, Badge, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Alerta = () => {
  const [insumos, setInsumos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const buscarInsumos = () => {
      fetch('http://localhost:3000/insumos/alerta')
        .then(res => res.json())
        .then(data => {
          if (!Array.isArray(data)) return;

          const formatados = data
            .map(insumo => ({
              id: insumo.id_insumos,
              nome: insumo.nome_insumos,
              quantidade: insumo.quantidade_insumos,
              tipoEstoque: insumo.tipo_alerta_estoque,
              tipoValidade: insumo.tipo_alerta_validade,
              unidade: insumo.unidade_medida || '',
              imagem: insumo.imagem_url || 'https://via.placeholder.com/150'
            }))
            .filter(insumo => insumo.tipoEstoque);

          const ordenados = formatados.sort((a, b) => {
            if (a.tipoEstoque === 'critico' && b.tipoEstoque !== 'critico') return -1;
            if (a.tipoEstoque !== 'critico' && b.tipoEstoque === 'critico') return 1;
            return a.quantidade - b.quantidade;
          });

          setInsumos(ordenados);
        })
        .catch(error => console.error('Erro ao buscar insumos:', error));
    };

    buscarInsumos();
    const intervalo = setInterval(buscarInsumos, 10000);
    return () => clearInterval(intervalo);
  }, []);

  const getCorDeFundo = (tipoEstoque) => {
    switch (tipoEstoque) {
      case 'critico': return '#ffe6e6';
      case 'antecipado': return '#fff9e6';
      default: return '#ffffff';
    }
  };

  const getBadge = (tipoEstoque) => {
    switch (tipoEstoque) {
      case 'critico': return <Badge bg="danger">Crítico</Badge>;
      case 'antecipado': return <Badge bg="warning" text="dark">Antecipado</Badge>;
      default: return null;
    }
  };

  const handleNavigate = id => navigate(`/visualizar/${id}`);

  return (
    <div>
      <NavBar />
      <Container style={{ marginTop: '100px' }}>
        <h1 className="mb-4 text-center">📦 Insumos em Alerta de Estoque</h1>

        <div className="d-flex justify-content-center mb-4">
          <Button
            variant="outline-primary"
            className="text-nowrap"
            onClick={() => navigate('/data/vencimento')}
          >
            <i className="bi bi-calendar-event me-2" />
            Alertas de Vencimento
          </Button>
        </div>

        {insumos.length === 0 ? (
          <p className="text-center">✅ Nenhum insumo em alerta.</p>
        ) : (
          <Row className="g-4 justify-content-center">
            {insumos.map(insumo => (
              <Col key={insumo.id} xs={12} md={6} lg={5}>
                <Card
                  className="h-100 shadow-sm"
                  style={{
                    backgroundColor: getCorDeFundo(insumo.tipoEstoque),
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Card.Body className="d-flex gap-3 align-items-center">
                    <img
                      src={insumo.imagem}
                      alt={insumo.nome}
                      className="rounded-4"
                      style={{
                        width: '100px',
                        height: '100px',
                        objectFit: 'contain',
                        backgroundColor: '#f8f9fa'
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <Card.Title className="mb-1 d-flex justify-content-between align-items-center">
                        <span>{insumo.nome}</span>
                        {getBadge(insumo.tipoEstoque)}
                      </Card.Title>
                      <Card.Text>
                        Quantidade: {Number(insumo.quantidade).toLocaleString('pt-BR')} {insumo.unidade}
                      </Card.Text>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleNavigate(insumo.id)}
                      >
                        <i className="bi bi-arrow-repeat me-1" />
                        Repor Estoque
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
};

export default Alerta;