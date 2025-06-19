import React, { useState, useEffect } from 'react';
import NavBar from '../../components/NavBar/NavBar';
import { Container, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Alerta = () => {
  const [insumos, setInsumos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3000/insumos/alerta')
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) {
          console.warn('Resposta inesperada:', data);
          setInsumos([]);
          return;
        }

        const insumosFormatados = data.map(insumo => ({
          id: insumo.id_insumos,
          nome: insumo.nome_insumos,
          quantidade: insumo.quantidade_insumos,
          tipoAlerta: insumo.tipo_alerta,
          imagem: insumo.imagem_url || 'https://via.placeholder.com/150'
        }));

        setInsumos(insumosFormatados);
      })
      .catch(error => console.error('Erro ao buscar insumos:', error));
  }, []);

  const handleNavigate = (id) => {
    navigate(`/visualizar/${id}`);
  };

  const getCorDeFundo = (tipoAlerta) => {
    if (tipoAlerta === 'critico') return '#f8d7da';      // vermelho claro
    if (tipoAlerta === 'antecipado') return '#fff3cd';   // amarelo claro
    return 'white';
  };

  const getCorDoIcone = (tipoAlerta) => {
    if (tipoAlerta === 'critico') return 'red';
    if (tipoAlerta === 'antecipado') return 'orange';
    return 'black';
  };

  return (
    <div>
      <NavBar />
      <Container style={{ marginTop: '100px' }}>
        <h1 className="mb-4">Insumos em Alerta de Estoque</h1>

        {insumos.length === 0 ? (
          <p>Nenhum insumo atingiu o nível de alerta.</p>
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
                  backgroundColor: getCorDeFundo(insumo.tipoAlerta)
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

                <div className="d-flex justify-content-between align-items-center w-100">
                  <div style={{ flexGrow: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        gap: '20px',
                        fontSize: '18px',
                        flexWrap: 'wrap',
                        color: 'black'
                      }}
                    >
                      <p><strong>Nome:</strong> {insumo.nome}</p>
                      <p><strong>Quantidade:</strong> {insumo.quantidade}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline-dark"
                      onClick={() => handleNavigate(insumo.id)}
                    >
                      Ver mais
                    </Button>
                  </div>

                  <i
                    className="bi bi-exclamation-triangle-fill"
                    style={{
                      fontSize: '32px',
                      color: getCorDoIcone(insumo.tipoAlerta)
                    }}
                    title={insumo.tipoAlerta === 'critico' ? 'Alerta Crítico' : 'Alerta Antecipado'}
                  />
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
