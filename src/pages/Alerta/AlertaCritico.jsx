import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';

const AlertaCriticoGlobal = () => {
  const [alertasPendentes, setAlertasPendentes] = useState([]);
  const [indexAtual, setIndexAtual] = useState(0);

  const getEstadosExibidos = () => {
    const raw = sessionStorage.getItem('estados_alerta_exibidos');
    return raw ? JSON.parse(raw) : {};
  };

  const setEstadosExibidos = (estados) => {
    sessionStorage.setItem('estados_alerta_exibidos', JSON.stringify(estados));
  };

  useEffect(() => {
    const buscarAlertas = () => {
      const exibidos = getEstadosExibidos();

      fetch('http://localhost:3000/insumos/alerta')
        .then(res => res.json())
        .then(data => {
          if (!Array.isArray(data)) return;

          const novosAlertas = [];

          data.forEach(insumo => {
            const { id_insumos: id, nome_insumos: nome, quantidade_insumos: quantidade, tipo_alerta_estoque: tipo, imagem_url } = insumo;

            if ((tipo === 'critico' || tipo === 'antecipado') && exibidos[id] !== tipo) {
              novosAlertas.push({
                id,
                nome,
                quantidade,
                tipo,
                imagem: imagem_url?.trim() ? imagem_url : 'https://via.placeholder.com/150'
              });

              exibidos[id] = tipo;
            }
          });

          if (novosAlertas.length > 0) {
            setAlertasPendentes(novosAlertas);
            setIndexAtual(0);
            setEstadosExibidos(exibidos);
          }
        })
        .catch(err => console.error('Erro ao buscar alertas:', err));
    };

    buscarAlertas();
    const interval = setInterval(buscarAlertas, 4000);
    return () => clearInterval(interval);
  }, []);

  const alertaAtual = alertasPendentes[indexAtual] || null;

  const handleNext = () => {
    if (indexAtual + 1 < alertasPendentes.length) {
      setIndexAtual(indexAtual + 1);
    } else {
      setAlertasPendentes([]);
    }
  };

  const getStyleCritico = tipo =>
    tipo === 'critico'
      ? {
          border: '3px solid red',
          backgroundColor: '#fff0f0',
          color: 'red',
          fontWeight: 'bold'
        }
      : {};

  return (
    <Modal show={!!alertaAtual} centered backdrop="static" keyboard={false}>
      <Modal.Header style={getStyleCritico(alertaAtual?.tipo)}>
        <Modal.Title>
          {alertaAtual?.tipo === 'critico'
            ? '🚨 ALERTA CRÍTICO DE ESTOQUE'
            : '⚠️ Atenção: Estoque Baixo'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={getStyleCritico(alertaAtual?.tipo)}>
        {alertaAtual && (
          <div className="text-center">
            <img
              src={alertaAtual.imagem}
              alt={alertaAtual.nome}
              style={{ maxWidth: '150px', marginBottom: '20px' }}
            />
            <h4>{alertaAtual.nome}</h4>
            <p>Estoque atual: <strong>{alertaAtual.quantidade}</strong></p>
            <p style={{ fontSize: '1.1rem' }}>
              {alertaAtual.tipo === 'critico'
                ? '🚨 REPOSIÇÃO URGENTE NECESSÁRIA!'
                : 'Estoque abaixo do ideal.'}
            </p>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer style={getStyleCritico(alertaAtual?.tipo)}>
        <Button
          variant={alertaAtual?.tipo === 'critico' ? 'danger' : 'warning'}
          onClick={handleNext}
        >
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AlertaCriticoGlobal;
