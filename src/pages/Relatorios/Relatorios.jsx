import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import NavBar from '../../components/NavBar/NavBar';
import { Container, Table, Badge } from 'react-bootstrap';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RelatorioInsumos = () => {
  const [relatorioData, setRelatorioData] = useState(null);
  const [periodo, setPeriodo] = useState('diario'); // 'diario' ou 'semanal'

  const fetchData = async () => {
    try {
      const endpoint = periodo === 'diario' 
        ? 'http://localhost:3000/relatorios/insumos-diario' 
        : 'http://localhost:3000/relatorios/insumos-semanal';
      
      const response = await fetch(endpoint);
      const data = await response.json();
      setRelatorioData(data);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [periodo]);

  // Gráfico dos 5 insumos com mais saídas
  const topInsumosChart = {
    labels: relatorioData?.dias || [],
    datasets: Object.keys(relatorioData?.dados || {}).map((dia, index) => {
      // Pegar os 5 insumos com mais saídas do dia
      const top5 = relatorioData?.dados[dia]?.slice(0, 5) || [];
      
      return {
        label: dia,
        data: top5.map(insumo => insumo.quantidade),
        backgroundColor: `hsl(${index * 60}, 70%, 50%)`,
        borderColor: `hsl(${index * 60}, 70%, 30%)`,
        borderWidth: 1,
      };
    })
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Top 5 Insumos com Mais Saídas - ${periodo === 'diario' ? 'Diário' : 'Semanal'}`,
      },
      tooltip: {
        callbacks: {
          afterLabel: (context) => {
            const dia = context.dataset.label;
            const index = context.dataIndex;
            const insumo = relatorioData?.dados[dia]?.[index];
            return insumo ? `Categoria: ${insumo.categoria}\nUnidade: ${insumo.unidade}` : '';
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Quantidade'
        }
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavBar />

      <Container style={{
        flex: 1,
        paddingTop: '15vh',  
        paddingBottom: '20px',
        marginTop: '0'        
      }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 style={{ fontSize: '2rem' }}>
            Relatório de Insumos - {periodo === 'diario' ? 'Diário' : 'Semanal'}
          </h1>
          <div>
            <button 
              className={`btn ${periodo === 'diario' ? 'btn-primary' : 'btn-outline-primary'} me-2`}
              onClick={() => setPeriodo('diario')}
            >
              Diário
            </button>
            <button 
              className={`btn ${periodo === 'semanal' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setPeriodo('semanal')}
            >
              Semanal
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col-12 mb-4">
            <div className="card h-100">
              <div className="card-header bg-white">
                <h5 style={{ fontWeight: '600' }}>Top 5 Insumos com Mais Saídas</h5>
              </div>
              <div className="card-body">
                <div style={{ height: '400px' }}>
                  <Bar data={topInsumosChart} options={options} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card mt-4">
          <div className="card-header bg-white d-flex justify-content-between align-items-center">
            <h5 style={{ fontWeight: '600' }}>Detalhes por Período</h5>
            <small className="text-muted">Ordenado por quantidade decrescente</small>
          </div>
          <div className="card-body">
            {relatorioData?.dias?.length ? (
              relatorioData.dias.map(dia => (
                <div key={dia} className="mb-4">
                  <h6 className="mb-3" style={{ fontWeight: '500', color: '#333' }}>
                    {periodo === 'diario' ? new Date(dia).toLocaleDateString('pt-BR') : `Semana ${dia}`}
                  </h6>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Insumo</th>
                        <th>Categoria</th>
                        <th>Quantidade</th>
                        <th>Unidade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {relatorioData.dados[dia]?.map((insumo, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{insumo.nome}</td>
                          <td>
                            <Badge bg={
                              insumo.categoria === 'Carnes' ? 'danger' : 
                              insumo.categoria === 'Perecíveis' ? 'warning' :
                              insumo.categoria === 'Molhos' ? 'primary' : 'success'
                            }>
                              {insumo.categoria}
                            </Badge>
                          </td>
                          <td>{insumo.quantidade}</td>
                          <td>{insumo.unidade}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <p>Nenhum dado disponível para o período selecionado</p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default RelatorioInsumos;