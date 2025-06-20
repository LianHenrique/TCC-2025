import React, { useEffect, useState } from 'react';
import NavBar from '../../components/NavBar/NavBar';
import { Container, Card } from 'react-bootstrap';

const DataVencimento = () => {
  const [insumos, setInsumos] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/alertas/vencimentos') 
      .then(res => res.json())
      .then(data => {
        const ordenados = [...data].sort((a, b) =>
          new Date(a.data_vencimento) - new Date(b.data_vencimento)
        );
        setInsumos(ordenados);
      })
      .catch(error => console.error('Erro ao buscar vencimentos:', error));
  }, []);

  const getCorDeFundo = (dataVencimento) => {
    const hoje = new Date();
    const vencimento = new Date(dataVencimento);
    const diasRestantes = Math.floor((vencimento - hoje) / (1000 * 60 * 60 * 24));

    if (diasRestantes <= 14) return '#f8d7da'; // vermelho claro
    if (diasRestantes <= 90) return '#fff3cd'; // amarelo claro
    return '#d4edda'; // verde claro
  };

  return (
    <div>
      <NavBar />
      <Container style={{ marginTop: '100px' }}>
        <h2 className="mb-4">Alertas de Vencimento dos insumos</h2>

        {insumos.map((insumo) => (
          <Card
            key={insumo.id_insumos}
            className="mb-3 shadow-sm"
            style={{
              backgroundColor: getCorDeFundo(insumo.data_vencimento),
              padding: '15px',
              borderRadius: '10px',
            }}
          >
            <div className="d-flex align-items-center">
              <img
                src={insumo.imagem_url}
                alt={insumo.nome_insumos}
                style={{ width: '100px', height: '100px', objectFit: 'contain', borderRadius: '10px', marginRight: '20px' }}
              />
              <div>
                <h5>{insumo.nome_insumos}</h5>
                <p className="mb-1">Categoria: {insumo.categoria}</p>
                <p className="mb-1">Quantidade: {insumo.quantidade_insumos}</p>
                <p className="mb-0">Vencimento: {new Date(insumo.data_vencimento).toLocaleDateString()}</p>
              </div>
            </div>
          </Card>
        ))}
      </Container>
    </div>
  );
};

export default DataVencimento;
