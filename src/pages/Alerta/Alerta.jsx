import React, { useState, useEffect } from 'react';
import NavBar from '../../components/NavBar/NavBar';
import { Container, Card, Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Alerta = () => {
  const [insumos, setInsumos] = useState([]);
  const [criticos, setCriticos] = useState([]);
  const [indexCritico, setIndexCritico] = useState(0);
  const navigate = useNavigate();

  const verificarSeAlertaJaFoiExibido = () => {
    return sessionStorage.getItem('alerta_critico_exibido') === 'true';
  };

  const marcarAlertaComoExibido = () => {
    sessionStorage.setItem('alerta_critico_exibido', 'true');
  };

  const resetarAlerta = () => {
    sessionStorage.removeItem('alerta_critico_exibido');
    setCriticos([]);
    setIndexCritico(0);
  };

  useEffect(() => {
    fetch('http://localhost:3000/insumos/alerta')
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) return setInsumos([]);

        const formatados = data.map(insumo => ({
          id: insumo.id_insumos,
          nome: insumo.nome_insumos,
          quantidade: insumo.quantidade_insumos,
          tipoAlerta: insumo.tipo_alerta,
          imagem: insumo.imagem_url || 'https://via.placeholder.com/150'
        }));

        const ordenados = formatados.sort((a, b) => {
          if (a.tipoAlerta === 'critico' && b.tipoAlerta !== 'critico') return -1;
          if (a.tipoAlerta !== 'critico' && b.tipoAlerta === 'critico') return 1;
          return a.quantidade - b.quantidade;
        });

        setInsumos(ordenados);

        const criticosFiltrados = ordenados.filter(i => i.tipoAlerta === 'critico');

        if (!verificarSeAlertaJaFoiExibido() && criticosFiltrados.length > 0) {
          setCriticos(criticosFiltrados);
          marcarAlertaComoExibido();
        }
      })
      .catch(error => console.error('Erro ao buscar insumos:', error));
  }, []);

  const alertaCriticoVisivel = criticos[indexCritico] || null;

  const handleNextCritico = () => {
    if (indexCritico + 1 < criticos.length) {
      setIndexCritico(indexCritico + 1);
    } else {
      setCriticos([]);
    }
  };

  const getCorDeFundo = tipoAlerta => {
    if (tipoAlerta === 'critico') return '#f8d7da';
    if (tipoAlerta === 'antecipado') return '#fff3cd';
    return 'white';
  };

  const handleNavigate = id => navigate(`/visualizar/${id}`);

  return (
    <div>
      <NavBar />
      <Container style={{ marginTop: '100px' }}>
        <h1 className="mb-4">Insumos em Alerta de Estoque</h1>
        <Button variant="secondary" onClick={resetarAlerta} className="mb-3">
          🔄 Resetar Alerta Crítico (MANTER EM FASE DE DESENVOLVIMENTO)
        </Button>

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
                <div className="d-flex justify-content-between align-items-center" style={{ width: '100%' }}>
                  <div style={{ flexGrow: 1 }}>
                    <div style={{ display: 'flex', gap: '20px', fontSize: '20px', flexWrap: 'wrap' }}>
                      <p>Nome: {insumo.nome}</p>
                      <p>Quantidade: {insumo.quantidade}</p>
                    </div>
                    <Button onClick={() => handleNavigate(insumo.id)} variant="danger">
                      Repor Estoque
                    </Button>
                  </div>

                  {insumo.tipoAlerta === 'critico' && (
                    <i className="bi bi-exclamation-circle-fill" style={{ color: 'red', fontSize: '32px', marginLeft: '20px' }} />
                  )}
                </div>
              </div>
            ))}
          </Card.Body>
        )}

        {/* Modal para ALERTA CRÍTICO */}
        <Modal show={!!alertaCriticoVisivel} centered backdrop="static" keyboard={false}>
          <Modal.Header>
            <Modal.Title>⚠️ Alerta Crítico de Estoque</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {alertaCriticoVisivel && (
              <div className="text-center">
                <img
                  src={alertaCriticoVisivel.imagem}
                  alt={alertaCriticoVisivel.nome}
                  style={{ maxWidth: '150px', marginBottom: '20px' }}
                />
                <h4>{alertaCriticoVisivel.nome}</h4>
                <p>
                  Estoque atual: <strong>{alertaCriticoVisivel.quantidade}</strong>
                </p>
                <p style={{ color: 'red', fontWeight: 'bold' }}>Reposição urgente necessária!</p>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleNextCritico}>
              OK
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default Alerta;