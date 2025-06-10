import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import NavBar from '../../components/NavBar/NavBar';
import { Container } from 'react-bootstrap';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const RelatorioFinanceiro = () => {
  const [relatorioData, setRelatorioData] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3000/relatorios/diario');
      const data = await response.json();
      setRelatorioData(data);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Gráfico de Custo Médio vs Lucro Médio por Cliente
  const custoLucroChart = {
    labels: relatorioData?.dias || [],
    datasets: [
      {
        label: 'Custo Médio por Cliente (R$)',
        data: relatorioData?.dados.map(d => d.custo_medio_cliente) || [],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.3,
        yAxisID: 'y',
      },
      {
        label: 'Lucro Médio por Cliente (R$)',
        data: relatorioData?.dados.map(d => d.lucro_medio_cliente) || [],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.3,
        yAxisID: 'y',
      }
    ]
  };
 

  // GRÁFICO DE LUCRO
  const lucratividadeChart = {
    labels: relatorioData?.dias || [],
    datasets: [
      {
        label: 'Lucro Total (R$)',
        data: relatorioData?.dados.map(d => d.lucro_total) || [],
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(54, 162, 235, 0.5)');
          gradient.addColorStop(1, 'rgba(54, 162, 235, 0)');
          return gradient;
        },
        fill: true,
        tension: 0.3,
      }
    ]
  };

  const options = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || '';
            if (label) label += ': ';
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Valor (R$)'
        },
        ticks: {
          callback: (value) => 'R$ ' + value.toFixed(2)
        }
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavBar />

      {/* ESTILIZAÇÃO DA NAVBAR */}
      <Container style={{
        flex: 1,
        paddingTop: '15vh',  
        paddingBottom: '20px',
        marginTop: '0'        
      }}>
        <h1 className="mb-4" style={{ fontSize: '2rem'}}>Relatório Financeiro Diário</h1>

        <div className="row">
          <div className="col-md-6 mb-4">
            <div className="card h-100">
              <div className="card-header bg-white">
                <h5 style={{ fontWeight: '600' }}>Custo vs Lucro por Cliente</h5>
              </div>
              <div className="card-body">
                <div style={{ height: '300px' }}>
                  <Line data={custoLucroChart} options={options} />
                </div>
                <p className="mt-3 text-muted">
                  Comparação entre o custo médio por cliente (vermelho) e o lucro médio por cliente (verde).
                  Valores negativos indicam prejuízo.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-6 mb-4">
            <div className="card h-100">
              <div className="card-header bg-white">
                <h5 style={{ fontWeight: '600' }}>Evolução do Lucro Diário</h5>
              </div>
              <div className="card-body">
                <div style={{ height: '300px' }}>
                  <Line data={lucratividadeChart} options={options} />
                </div>
                <p className="mt-3 text-muted">
                  Evolução do lucro total do restaurante. Área abaixo da linha indica períodos positivos.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card mt-4">
          <div className="card-header bg-white">
            <h5 style={{ fontWeight: '600' }}>Resumo Financeiro</h5>
          </div>
          <div className="card-body">
            {relatorioData?.dados.map((dia, index) => (
              <div key={index} className="mb-3 p-3 border rounded">
                <h6 style={{ fontWeight: '500' }}>{dia.dia}</h6>
                <div className="row">
                  <div className="col-md-4">
                    <p>Clientes atendidos: <strong>{dia.qtd_clientes}</strong></p>
                  </div>
                  <div className="col-md-4">
                    <p>Custo médio: <strong className={dia.custo_medio_cliente > 50 ? 'text-danger' : ''}>
                      {dia.custo_medio_cliente.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </strong></p>
                  </div>
                  <div className="col-md-4">
                    <p>Lucro médio: <strong className={dia.lucro_medio_cliente >= 0 ? 'text-success' : 'text-danger'}>
                      {dia.lucro_medio_cliente.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </strong></p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default RelatorioFinanceiro;