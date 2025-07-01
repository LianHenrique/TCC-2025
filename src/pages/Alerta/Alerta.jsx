import { useState, useEffect, useContext } from 'react';
import { Container, Card, Button, Badge, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

import styles from "./Alerta.module.css";
import { ThemeContext } from '../../Contexts/ThemeContext';
import NavBar from '../../components/NavBar/NavBar';

const Alerta = () => {
  const [insumos, setInsumos] = useState([]);
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  useEffect(() => {
    const buscarInsumos = () => {
      fetch('http://localhost:3000/insumos/alerta')
        .then(res => res.json())
        .then(data => {
          if (!Array.isArray(data)) return;

          // Formata e filtra os insumos com alertas
          const formatados = data
            .map(insumo => {
              // Corrigir a URL da imagem
              let imagemUrl = insumo.imagem_url?.trim() || '';

              // Se já for uma URL completa, usar diretamente
              if (imagemUrl.startsWith('http://') || imagemUrl.startsWith('https://')) {
                return {
                  id: insumo.id_insumos,
                  nome: insumo.nome_insumos,
                  quantidade: insumo.quantidade_insumos,
                  tipoEstoque: insumo.tipo_alerta_estoque,
                  tipoValidade: insumo.tipo_alerta_validade,
                  unidade: insumo.unidade_medida || '',
                  imagem: imagemUrl,
                  dataVencimento: insumo.data_vencimento
                };
              }
              
              // Se começar com '/uploads', adicionar apenas o domínio
              if (imagemUrl.startsWith('/uploads/')) {
                return {
                  id: insumo.id_insumos,
                  nome: insumo.nome_insumos,
                  quantidade: insumo.quantidade_insumos,
                  tipoEstoque: insumo.tipo_alerta_estoque,
                  tipoValidade: insumo.tipo_alerta_validade,
                  unidade: insumo.unidade_medida || '',
                  imagem: `http://localhost:3000${imagemUrl}`,
                  dataVencimento: insumo.data_vencimento
                };
              }
              
              // Se for apenas um nome de arquivo, montar o caminho completo
              if (imagemUrl) {
                return {
                  id: insumo.id_insumos,
                  nome: insumo.nome_insumos,
                  quantidade: insumo.quantidade_insumos,
                  tipoEstoque: insumo.tipo_alerta_estoque,
                  tipoValidade: insumo.tipo_alerta_validade,
                  unidade: insumo.unidade_medida || '',
                  imagem: `http://localhost:3000/uploads/${imagemUrl}`,
                  dataVencimento: insumo.data_vencimento
                };
              }
              
              // Caso não tenha imagem, usar placeholder
              return {
                id: insumo.id_insumos,
                nome: insumo.nome_insumos,
                quantidade: insumo.quantidade_insumos,
                tipoEstoque: insumo.tipo_alerta_estoque,
                tipoValidade: insumo.tipo_alerta_validade,
                unidade: insumo.unidade_medida || '',
                imagem: 'https://via.placeholder.com/150',
                dataVencimento: insumo.data_vencimento
              };
            })
            .filter(insumo => insumo.tipoEstoque || insumo.tipoValidade);

          setInsumos(formatados);
        })
        .catch(error => console.error('Erro ao buscar insumos:', error));
    };

    buscarInsumos();
    const intervalo = setInterval(buscarInsumos, 30000); // Atualiza a cada 30 segundos
    return () => clearInterval(intervalo);
  }, []);

  const getCorDeFundo = (tipoEstoque) => {
    if (darkMode) {
      switch (tipoEstoque) {
        case 'critico': return '#880100';
        case 'antecipado': return '#a78911';
        default: return '#1e1e1e';
      }
    } else {
      switch (tipoEstoque) {
        case 'critico': return '#ffe6e6';
        case 'antecipado': return '#ffffd9';
        default: return '#ffffff';
      }
    }
  };

  const getBadge = (insumo) => {
    if (insumo.tipoEstoque === 'critico') 
      return <Badge bg="danger">Estoque Crítico</Badge>;
    
    if (insumo.tipoValidade === 'vencido') 
      return <Badge bg="dark">Vencido</Badge>;
    
    if (insumo.tipoEstoque === 'antecipado') 
      return <Badge bg="warning" text="dark">Estoque Baixo</Badge>;
    
    if (insumo.tipoValidade === 'vencendo') 
      return <Badge bg="warning" text="dark">Vencendo</Badge>;
    
    return null;
  };

  const calcularDiasVencimento = (dataVencimento) => {
    if (!dataVencimento) return null;
    
    const hoje = new Date();
    const vencimento = new Date(dataVencimento);
    const diffTime = vencimento - hoje;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const handleNavigate = id => navigate(`/visualizar/${id}`);

  return (
    <div>
      <NavBar />

      <Container style={{
        marginTop: "150px"
      }}>
        <h1 className="mb-4 text-center">📦 Insumos em Alerta de Estoque</h1>

        <div className="d-flex justify-content-center mb-4 gap-2">
          <Button
            variant="outline-primary"
            className="text-nowrap"
            onClick={() => navigate('/data/vencimento')}
          >
            <i className="bi bi-calendar-event me-2" />
            Todos os Vencimentos
          </Button>
        </div>

        {insumos.length === 0 ? (
          <div className="text-center p-5 border rounded bg-light">
            <i className="bi bi-check-circle-fill text-success fs-1 mb-3"></i>
            <p className="fs-4">Nenhum alerta no momento!</p>
            <p className="text-muted">Todos os insumos estão com estoque adequado e dentro do prazo de validade.</p>
          </div>
        ) : (
          <Row className="g-4 justify-content-center">
            {insumos.map(insumo => (
              <Col key={insumo.id} xs={12} md={7} lg={5}>
                <Card
                  className={`h-100 shadow-sm ${
                    darkMode ? styles.cardDark : styles.cardLight
                  } ${styles.card}`}
                  style={{
                    backgroundColor: getCorDeFundo(insumo.tipoEstoque),
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Card.Body className="d-flex gap-3 align-items-center">
                    <img
                      src={insumo.imagem}
                      alt={insumo.nome}
                      className="rounded-4"
                      style={{
                        width: '100px',
                        height: '100px',
                        objectFit: 'contain',
                        backgroundColor: "#fff"
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <Card.Title className="mb-1 d-flex justify-content-between align-items-center">
                        <span>{insumo.nome}</span>
                        {getBadge(insumo.tipoEstoque)}
                      </Card.Title>
                      <Card.Text>
                        Quantidade: {Number(insumo.quantidade).toLocaleString('pt-BR')} {insumo.unidade}
                      </Card.Text>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleNavigate(insumo.id)}
                      >
                        <i className="bi bi-arrow-repeat me-1" />
                        Repor Estoque
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
};

export default Alerta;
