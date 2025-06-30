import { useState, useEffect } from 'react';
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
            const {
              id_insumos: id,
              nome_insumos: nome,
              quantidade_insumos: quantidade,
              tipo_alerta_estoque: tipo,
              imagem_url
            } = insumo;

            if ((tipo === 'critico' || tipo === 'antecipado') && exibidos[id] !== tipo) {
              novosAlertas.push({
                id,
                nome,
                quantidade,
                tipo,
                imagem: imagem_url?.trim()
                  ? `http://localhost:3000${imagem_url.trim()}`
                  : 'https://via.placeholder.com/150'
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

  const estiloAlerta = (tipo) => {
    return tipo === 'critico'
      ? {
        icon: '🚨',
        corTexto: '#b71c1c',
        corBotao: 'danger',
        titulo: 'Alerta Crítico de Estoque',
        descricao: 'Reposição urgente necessária!'
      }
      : {
        icon: '⚠️',
        corTexto: '#8a6d3b',
        corBotao: 'warning',
        titulo: 'Estoque Baixo',
        descricao: 'Estoque abaixo do ideal.'
      };
  };

  const estilo = alertaAtual ? estiloAlerta(alertaAtual.tipo) : null;

  return (
    <Modal
      show={!!alertaAtual}
      centered
      backdrop="static"
      keyboard={false}
      dialogClassName="custom-alert-modal"
    >
      {alertaAtual && (
        <div
          style={{
            background: 'rgba(255,255,255,0.95)',
            padding: '25px',
            borderRadius: '20px',
            textAlign: 'center',
            boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
            animation: 'fadeInScale 0.4s ease-out'
          }}
        >
          <div style={{ fontSize: '48px', color: estilo.corTexto, marginBottom: '10px' }}>
            {estilo.icon}
          </div>
          <h4 style={{ fontWeight: 'bold', color: estilo.corTexto }}>{estilo.titulo}</h4>
          <img
            src={alertaAtual.imagem}
            alt={alertaAtual.nome}
            style={{
              width: '100px',
              height: '100px',
              objectFit: 'contain',
              margin: '20px 0',
              borderRadius: '10px',
              border: '1px solid #ccc',
              backgroundColor: '#fff',
              padding: '5px'
            }}
          />
          <h5 className="fw-semibold">{alertaAtual.nome}</h5>
          <p>
            Estoque atual: <strong>{alertaAtual.quantidade}</strong>
          </p>
          <p style={{ fontSize: '1.1rem' }}>{estilo.descricao}</p>
          <Button variant={estilo.corBotao} size="lg" onClick={handleNext}>
            Entendi
          </Button>
        </div>
      )}
    </Modal>
  );
};

export default AlertaCriticoGlobal;
