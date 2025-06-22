import React, { useEffect, useState, useRef } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import html2pdf from 'html2pdf.js';
import NavBar from '../../components/NavBar/NavBar';
import { Container, Table, Badge } from 'react-bootstrap';

ChartJS.register(ArcElement, Tooltip, Legend);

const RelatorioInsumos = () => {
  const [relatorioData, setRelatorioData] = useState(null);
  const [periodo, setPeriodo] = useState('diario');
  const relatorioRef = useRef();

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

  const handleDownloadPDF = () => {
    const element = relatorioRef.current;
    const opt = {
      margin: 0.5,
      filename: `RelatorioInsumos_${periodo}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 1.5 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' }
    };
    html2pdf().set(opt).from(element).save();
  };

  const preparePieData = () => {
    if (!relatorioData || !relatorioData.dias?.length) {
      return { labels: [], datasets: [] };
    }

    const todosInsumos = [];

    relatorioData.dias.forEach(dia => {
      (relatorioData.dados[dia] || []).forEach(insumo => {
        const existente = todosInsumos.find(i => i.nome === insumo.nome);
        if (existente) existente.quantidade += insumo.quantidade;
        else todosInsumos.push({ ...insumo });
      });
    });

    const top5 = todosInsumos.sort((a, b) => b.quantidade - a.quantidade).slice(0, 5);

    return {
      labels: top5.map(i => i.nome),
      datasets: [{
        data: top5.map(i => i.quantidade),
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
        borderWidth: 1
      }]
    };
  };

  const pieData = preparePieData();

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: `Top 5 Insumos com Mais Saídas - ${periodo === 'diario' ? 'Diário' : 'Semanal'}`
      }
    },
    maintainAspectRatio: false
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavBar />

      <Container
        ref={relatorioRef}
        style={{ flex: 1, paddingTop: '15vh', paddingBottom: '20px' }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 style={{ fontSize: '2rem' }}>
            Relatório de Insumos - {periodo === 'diario' ? 'Diário' : 'Semanal'}
          </h1>
          <div>
            <button className="btn btn-outline-secondary me-2" onClick={handleDownloadPDF}>
              Baixar PDF
            </button>
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
              <div className="card-body text-center">
                <div style={{ height: '400px', maxWidth: '600px', margin: '0 auto' }}>
                  {pieData.labels.length > 0 ? (
                    <Pie data={pieData} options={options} />
                  ) : (
                    <p className="mt-5">Nenhum dado disponível para exibir</p>
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
                  <h6 className="mb-3" style={{ fontWeight: '500' }}>
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
                      {relatorioData.dados[dia]?.map((i, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>{i.nome}</td>
                          <td>
                            <Badge bg={
                              i.categoria === 'Carnes' ? 'danger' :
                              i.categoria === 'Perecíveis' ? 'dark' :
                              i.categoria === 'Molhos' ? 'success' : 'primary'
                            }>
                              {i.categoria}
                            </Badge>
                          </td>
                          <td>{i.quantidade}</td>
                          <td>{i.unidade}</td>
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
