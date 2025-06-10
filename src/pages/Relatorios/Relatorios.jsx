import React, { useEffect, useState } from 'react';
import NavBar from '../../components/NavBar/NavBar';
import { Col, Container } from 'react-bootstrap';
import { Line } from 'react-chartjs-2'; // Importando apenas o componente Line
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';

// Registrando apenas os componentes necessários para gráficos de linha
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Relatorios = () => {
  const [funcionarios, setFuncionarios] = useState([]);
  const [custosData, setCustosData] = useState(null);
  const [lucroData, setLucroData] = useState(null);

  // Buscar dados de custos e lucros
  const fetchFinancialData = async () => {
    try {
      const response = await fetch('http://localhost:3000/relatorios/financeiro');
      const data = await response.json();
      
      // Configuração para o gráfico de custos (linha única)
      setCustosData({
        labels: data.dias,
        datasets: [
          {
            label: 'Custo médio por item (R$)',
            data: data.dados.map(d => d.custo_medio_item),
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            tension: 0.4, // Suaviza a curva
            fill: true, // Preenche a área abaixo da linha
            borderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: 'rgba(255, 99, 132, 1)',
          }
        ]
      });

      // Configuração para o gráfico de faturamento vs lucro (utilizar duas linhas)
      setLucroData({
        labels: data.dias,
        datasets: [
          {
            label: 'Faturamento diário (R$)',
            data: data.dados.map(d => d.faturamento_bruto),
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.1)',
            tension: 0.4,
            borderWidth: 3,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
          {
            label: 'Lucro diário (R$)',
            data: data.dados.map(d => d.lucro),
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.1)',
            tension: 0.4,
            borderWidth: 3,
            borderDash: [5, 5], // Linha tracejada
            pointRadius: 4,
            pointHoverRadius: 6,
          }
        ]
      });

    } catch (error) {
      console.error('Erro ao buscar dados financeiros:', error);
    }
  };

  const fetchFuncionarios = async () => {
  };

  useEffect(() => {
    if (funcionarios.length === 0) {
      fetchFuncionarios();
    }
    fetchFinancialData();
  }, []);

  // Opções personalizadas para os gráficos de linha
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
        }
      },
      title: {
        display: true,
        text: 'Análise Financeira Diária',
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: R$ ${context.parsed.y.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Valor (R$)',
          font: {
            weight: 'bold'
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    elements: {
      line: {
        tension: 0.4
      },
      point: {
        radius: 4,
        hoverRadius: 6
      }
    }
  };

  return (
    <div>
      <NavBar />
      <Container className='d-flex flex-wrap' style={{ marginTop: "90px" }}>
        <Col className='shadow rounded-5 m-2' style={{ padding: "10px", maxWidth: "500px", minWidth: "300px" }}>
          <h1 style={{ paddingLeft: "30px", paddingTop: "10px" }}>Custos Operacionais</h1>
          
          {custosData && (
            <div style={{ height: '300px', marginBottom: '20px', position: 'relative' }}>
              <Line 
                options={lineChartOptions} 
                data={custosData} 
              />
            </div>
          )}
          
          <div style={{ paddingLeft: "30px" }}>
            <h3>Análise de Custos</h3>
            <p>
              A linha mostra a variação diária do custo médio por item.
              Tendência ascendente indica aumento nos custos dos insumos.
            </p>
          </div>
        </Col>

        <Col className='shadow rounded-5 m-2' style={{ padding: "10px", maxWidth: "500px" }}>
          <h1 style={{ paddingLeft: "30px", paddingTop: "10px" }}>Faturamento vs Lucro</h1>
          
          {lucroData && (
            <div style={{ height: '300px', marginBottom: '20px', position: 'relative' }}>
              <Line 
                options={lineChartOptions} 
                data={lucroData} 
              />
            </div>
          )}
          
          <div style={{ paddingLeft: "30px" }}>
            <h3>Análise de Lucratividade</h3>
            <p>
              Comparação entre faturamento bruto (linha azul) e lucro líquido
              (linha tracejada verde). A diferença vertical representa os custos.
            </p>
          </div>
        </Col>
      </Container>
    </div>
  );
};

export default Relatorios;