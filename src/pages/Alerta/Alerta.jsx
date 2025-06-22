import React, { useState, useEffect } from 'react';
import NavBar from '../../components/NavBar/NavBar';
import { Container, Card, Button } from 'react-bootstrap';
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

  const getCorDeFundo = (insumo) => {
    if (insumo.tipoEstoque === 'critico') return '#f5b5b5';
    if (insumo.tipoEstoque === 'antecipado') return '#ffe082';
    return 'white';
  };

  const handleNavigate = id => navigate(`/visualizar/${id}`);

  return (
    <div>
      <NavBar />
      <Container style={{ marginTop: '100px' }}>
        <h1 className="mb-4">Insumos em Alerta de Estoque</h1>

        <div className="mb-4">
          <Button
            variant="primary"
            className="text-white"
            onClick={() => navigate('/data/vencimento')}
          >
            Alertas De Vencimento
          </Button>
        </div>

        {insumos.length === 0 ? (
          <p>Nenhum insumo em alerta.</p>
        ) : (
          <Card.Body className="d-flex flex-wrap gap-4 justify-content-start">
            {insumos.map(insumo => (
              <div
                key={insumo.id}
                className="shadow rounded d-flex gap-3 align-items-center"
                style={{
                  width: '100%',
                  maxWidth: '625px',
                  padding: '10px',
                  backgroundColor: getCorDeFundo(insumo)
                }}
              >
                <img
                  src={insumo.imagem}
                  alt={insumo.nome}
                  className="img-fluid rounded-5"
                  style={{
                    width: '100px',
                    height: '100px',
                    objectFit: 'contain',
                    backgroundColor: '#f8f9fa'
                  }}
                />
                <div className="d-flex justify-content-between align-items-center" style={{ width: '100%' }}>
                  <div style={{ flexGrow: 1 }}>
                    <div style={{ display: 'flex', gap: '20px', fontSize: '20px', flexWrap: 'wrap' }}>
                      <p>Nome: {insumo.nome}</p>
                      <p>
                        Quantidade: {Number(insumo.quantidade).toLocaleString('pt-BR')} {insumo.unidade}
                      </p>
                    </div>

                    <Button onClick={() => handleNavigate(insumo.id)} variant="danger">
                      Repor Estoque
                    </Button>
                  </div>

                  {insumo.tipoEstoque === 'critico' && (
                    <i className="bi bi-exclamation-circle-fill" style={{ color: 'red', fontSize: '32px', marginLeft: '20px' }} />
                  )}
                </div>
              </div>
            ))}
          </Card.Body>
        )}
      </Container>
    </div>
  );
};

export default Alerta;