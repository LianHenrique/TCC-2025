import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';

const AlertaCriticoGlobal = () => {
  const [criticos, setCriticos] = useState([]);
  const [indexCritico, setIndexCritico] = useState(0);

  const getIdsJaExibidos = () => {
    const item = sessionStorage.getItem('alertas_ja_exibidos');
    return item ? JSON.parse(item) : [];
  };

  const marcarIdsComoExibidos = novosIds => {
    const atuais = getIdsJaExibidos();
    const atualizados = Array.from(new Set([...atuais, ...novosIds]));
    sessionStorage.setItem('alertas_ja_exibidos', JSON.stringify(atualizados));
  };

  useEffect(() => {
    const buscarInsumos = () => {
      fetch('http://localhost:3000/insumos/alerta')
        .then(res => res.json())
        .then(data => {
          if (!Array.isArray(data)) return;

          const formatados = data.map(insumo => ({
            id: insumo.id_insumos,
            nome: insumo.nome_insumos,
            quantidade: insumo.quantidade_insumos,
            tipoAlertaEstoque: insumo.tipo_alerta_estoque,
            tipoAlertaValidade: insumo.tipo_alerta_validade,
            imagem: insumo.imagem_url || 'https://via.placeholder.com/150'
          }));

          const criticos = formatados.filter(i => i.tipoAlertaEstoque === 'critico');
          const idsJaExibidos = getIdsJaExibidos();
          const novos = criticos.filter(i => !idsJaExibidos.includes(i.id));

          if (novos.length > 0) {
            setCriticos(novos);
            setIndexCritico(0);
            marcarIdsComoExibidos(novos.map(i => i.id));
          }
        })
        .catch(err => console.error('Erro ao verificar alertas críticos:', err));
    };

    buscarInsumos();
    const interval = setInterval(buscarInsumos, 10000);
    return () => clearInterval(interval);
  }, []);

  const alertaCriticoVisivel = criticos[indexCritico] || null;

  const handleNext = () => {
    if (indexCritico + 1 < criticos.length) {
      setIndexCritico(indexCritico + 1);
    } else {
      setCriticos([]);
    }
  };

  return (
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
        <Button variant="danger" onClick={handleNext}>
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AlertaCriticoGlobal;