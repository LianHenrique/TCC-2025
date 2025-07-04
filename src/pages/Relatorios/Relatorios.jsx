import { useEffect, useState, useRef } from 'react';
import { Pie } from 'react-chartjs-2';
import html2pdf from 'html2pdf.js';
import NavBar from '../../components/NavBar/NavBar';
import { Container, Table, Badge, Button, Spinner, ButtonGroup } from 'react-bootstrap';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const RelatorioInsumos = () => {
  const [relatorioData, setRelatorioData] = useState(null);
  const [periodo, setPeriodo] = useState('diario');
  const [loading, setLoading] = useState(false);
  const relatorioRef = useRef();

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoint = `/relatorios/insumos-${periodo}`;
      const res = await fetch(`http://localhost:3000${endpoint}`);
      const data = await res.json();
      setRelatorioData(data);
    } catch (e) {
      console.error('Erro ao buscar dados:', e);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [periodo]);

  const handleDownloadPDF = () => {
    html2pdf().set({
      margin: 0.5,
      filename: `RelatorioInsumos_${periodo}.pdf`,
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' },
    }).from(relatorioRef.current).save();
  };

  const preparePieData = () => {
    if (!relatorioData?.dias?.length) return { labels: [], datasets: [] };

    const diaMaisRecente = relatorioData.dias[0];
    const dadosDoDia = relatorioData.dados[diaMaisRecente] || [];

    const topInsumos = [...dadosDoDia]
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 5);

    return {
      labels: topInsumos.map(item => item.nome),
      datasets: [{
        data: topInsumos.map(item => item.quantidade),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      }],
      metadata: topInsumos.map(item => ({
        unidade: item.unidade,
        categoria: item.categoria
      }))
    };
  };

  const getBadgeColor = c => {
    switch (c) {
      case 'Carnes': return 'danger';
      case 'Perecíveis': return 'secondary';
      case 'Molhos': return 'success';
      case 'Bebidas': return 'info';
      default: return 'primary';
    }
  };

  const pieData = preparePieData();

  // Função para formatar a data do relatório
  const getDataRelatorio = () => {
    if (!relatorioData?.dias?.length) return '';
    
    if (periodo === 'diario') {
      // Para relatório diário, mostra a data mais recente
      const dataMaisRecente = relatorioData.dias[0];
      return new Date(dataMaisRecente).toLocaleDateString('pt-BR');
    } else {
      // Para relatório semanal, mostra o intervalo de datas
      const datas = relatorioData.dias.map(d => new Date(d));
      const primeiraData = new Date(Math.min(...datas));
      const ultimaData = new Date(Math.max(...datas));
      return `${primeiraData.toLocaleDateString('pt-BR')} a ${ultimaData.toLocaleDateString('pt-BR')}`;
    }
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <NavBar />
      <Container ref={relatorioRef} className="pt-5 pb-5" style={{ marginTop: "70px" }}>
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">📊 Relatório de Insumos</h2>
            <p className="mb-0">
              {periodo === 'diario' 
                ? `Dados do dia ${getDataRelatorio()}` 
                : `Dados da semana (${getDataRelatorio()})`}
            </p>
          </div>
          <div className="d-flex flex-column flex-md-row gap-2">
            <Button variant="success" onClick={handleDownloadPDF}>
              📥 Exportar PDF
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <>
            {/* Gráfico de Pizza */}
            <div style={{ height: 400, maxWidth: 600, margin: 'auto' }}>
              {pieData.labels.length ? (
                <Pie
                  data={{
                    labels: pieData.labels,
                    datasets: pieData.datasets
                  }}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          font: {
                            size: 14
                          }
                        }
                      },
                      tooltip: {
                        callbacks: {
                          label: (context) => {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const unidade = pieData.metadata[context.dataIndex]?.unidade || 'unidade';
                            return `${label}: ${value} ${unidade}`;
                          }
                        }
                      }
                    }
                  }}
                />
              ) : (
                <p className="text-muted py-5">Nenhum dado disponível</p>
              )}
            </div>

            {/* Tabela detalhada */}
            <div className="card shadow-sm rounded">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-semibold">Detalhamento por {periodo === 'diario' ? 'Dia' : 'Semana'}</h5>
                <span className="text-muted small">Ordenado por quantidade</span>
              </div>
              <div className="card-body">
                {relatorioData?.dias?.length ? relatorioData.dias.map(dia => (
                  <div key={dia} className="mb-4">
                    <h6 className="text-primary fw-semibold mb-2">
                      {periodo === 'diario' 
                        ? new Date(dia).toLocaleDateString('pt-BR', { 
                            weekday: 'long', 
                            day: '2-digit', 
                            month: 'long', 
                            year: 'numeric' 
                          }) 
                        : `Semana ${dia}`}
                    </h6>
                    <div className="table-responsive rounded shadow-sm border">
                      <Table
                        bordered
                        hover
                        responsive
                        className="mb-0 table-sm align-middle custom-table"
                        style={{ fontSize: '0.95rem' }}
                      >
                        <thead className="sticky-top shadow-sm" style={{ top: 0, zIndex: 1 }}>
                          <tr className="text-center fw-bold text-secondary">
                            <th style={{ minWidth: 50 }}>#</th>
                            <th style={{ minWidth: 180 }}>Insumo</th>
                            <th style={{ minWidth: 120 }}>Categoria</th>
                            <th style={{ minWidth: 80 }}>Qtd</th>
                            <th style={{ minWidth: 80 }}>Unid.</th>
                          </tr>
                        </thead>
                        <tbody>
                          {relatorioData.dados[dia]?.map((i, idx) => (
                            <tr key={idx} className="text-center">
                              <td className="fw-semibold">{idx + 1}</td>
                              <td className="text-start">{i.nome}</td>
                              <td>
                                <Badge bg={getBadgeColor(i.categoria)}>{i.categoria}</Badge>
                              </td>
                              <td>{i.quantidade}</td>
                              <td>{i.unidade}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-4 text-muted">Nenhum dado para o período.</div>
                )}
              </div>
            </div>
          </>
        )}
      </Container>
    </div>
  );
};

export default RelatorioInsumos;