import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import NavBar from '../../components/NavBar/NavBar';
import { Container, Table, Badge } from 'react-bootstrap';

ChartJS.register(ArcElement, Tooltip, Legend);

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

  // Prepara os dados para o gráfico de pizza
  const preparePieData = () => {
    if (!relatorioData || !relatorioData.dias || relatorioData.dias.length === 0) {
      return {
        labels: [],
        datasets: []
      };
    }

    // Para o gráfico de pizza, vamos mostrar os 5 insumos mais utilizados no período
    const todosInsumos = [];
    
    // Agregamos todos os insumos de todos os dias
    relatorioData.dias.forEach(dia => {
      const insumosDoDia = relatorioData.dados[dia] || [];
      insumosDoDia.forEach(insumo => {
        const existente = todosInsumos.find(i => i.nome === insumo.nome);
        if (existente) {
          existente.quantidade += insumo.quantidade;
        } else {
          todosInsumos.push({...insumo});
        }
      });
    });

    // Ordenamos por quantidade e pegamos os top 5
    const top5 = todosInsumos
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 5);

    return {
      labels: top5.map(insumo => insumo.nome),
      datasets: [{
        data: top5.map(insumo => insumo.quantidade),
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1,
      }]
    };
  };

  const pieData = preparePieData();

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
            // Encontramos o insumo correspondente no conjunto completo de dados
            const nomeInsumo = pieData.labels[context.dataIndex];
            let insumoInfo = null;
            
            // Procuramos o insumo em todos os dias
            for (const dia of relatorioData?.dias || []) {
              const encontrado = relatorioData.dados[dia]?.find(i => i.nome === nomeInsumo);
              if (encontrado) {
                insumoInfo = encontrado;
                break;
              }
            }
            
            return insumoInfo ? `Categoria: ${insumoInfo.categoria}\nUnidade: ${insumoInfo.unidade}` : '';
          }
        }
      }
    },
    maintainAspectRatio: false
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
                  {pieData.labels.length > 0 ? (
                    <Pie data={pieData} options={options} />
                  ) : (
                    <div className="d-flex justify-content-center align-items-center h-100">
                      <p>Nenhum dado disponível para exibir</p>
                    </div>
                  )}
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
                  <Table bordered hover>
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
                              insumo.categoria === 'Perecíveis' ? 'dark' :
                              insumo.categoria === 'Molhos' ? 'success' : 'primary'
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