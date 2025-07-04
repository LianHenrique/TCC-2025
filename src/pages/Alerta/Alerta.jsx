import { useState, useEffect, useContext } from 'react';
import { Container, Card, Button, Badge, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { AuthContext } from '../../Contexts/UserContext'; // Importe do UserContext
import styles from "./Alerta.module.css";
import { ThemeContext } from '../../Contexts/ThemeContext';
import NavBar from '../../components/NavBar/NavBar';

const Alerta = () => {
  const [insumos, setInsumos] = useState([]);
  const { darkMode } = useContext(ThemeContext);
  const { cargoUsuario } = useContext(AuthContext); // Use cargoUsuario
  const navigate = useNavigate();

  // Verifica se o usuário tem permissão
  const temPermissao = cargoUsuario === 'ADM' || cargoUsuario === 'Gerente';

  useEffect(() => {
    if (!temPermissao) {
      navigate('/home'); // Redireciona se não tiver permissão
      return;
    }

    const buscarInsumos = () => {
      fetch('http://localhost:3000/insumos/alerta')
        .then(res => res.json())
        .then(data => {
          if (!Array.isArray(data)) return;

          const formatados = data
            .map(insumo => {
              let imagemUrl = insumo.imagem_url?.trim() || '';

              if (imagemUrl.startsWith('http://') || imagemUrl.startsWith('https://')) {
                return { ...formata(insumo), imagem: imagemUrl };
              }

              if (imagemUrl.startsWith('/uploads/')) {
                return { ...formata(insumo), imagem: `http://localhost:3000${imagemUrl}` };
              }

              if (imagemUrl) {
                return { ...formata(insumo), imagem: `http://localhost:3000/uploads/${imagemUrl}` };
              }

              return { ...formata(insumo), imagem: 'https://via.placeholder.com/150' };
            })
            .filter(insumo => insumo.tipoEstoque);

          setInsumos(formatados);
        })
        .catch(error => console.error('Erro ao buscar insumos:', error));
    };

    buscarInsumos();
    const intervalo = setInterval(buscarInsumos, 30000);
    return () => clearInterval(intervalo);
  }, [temPermissao, navigate]);

  const formata = (insumo) => ({
    id: insumo.id_insumos,
    nome: insumo.nome_insumos,
    quantidade: insumo.quantidade_insumos,
    tipoEstoque: insumo.tipo_alerta_estoque,
    tipoValidade: insumo.tipo_alerta_validade,
    unidade: insumo.unidade_medida || '',
    dataVencimento: insumo.data_vencimento
  });

  const getCorDeFundo = (tipoEstoque, tipoValidade) => {
    if (darkMode) {
      if (tipoEstoque === 'critico') return '#880100';
      if (tipoEstoque === 'antecipado') return '#a78911';
      if (tipoValidade === 'vencido') return '#6c757d';
      if (tipoValidade === 'vencendo') return '#a78911';
      return '#1e1e1e';
    } else {
      if (tipoEstoque === 'critico') return '#ffe6e6';
      if (tipoEstoque === 'antecipado') return '#ffffd9';
      if (tipoValidade === 'vencido') return '#dee2e6';
      if (tipoValidade === 'vencendo') return '#ffffd9';
      return '#ffffff';
    }
  };

  const getBadge = (insumo) => {
    const badges = [];

    if (insumo.tipoEstoque === 'critico')
      badges.push(<Badge bg="danger" className="ms-2" key="estoque-critico">Estoque Crítico</Badge>);

    if (insumo.tipoEstoque === 'antecipado')
      badges.push(<Badge bg="warning" text="dark" className="ms-2" key="estoque-baixo">Estoque Baixo</Badge>);

    if (insumo.tipoValidade === 'vencido')
      badges.push(<Badge bg="dark" className="ms-2" key="vencido">Vencido</Badge>);

    if (insumo.tipoValidade === 'vencendo')
      badges.push(<Badge bg="warning" text="dark" className="ms-2" key="vencendo">Vencendo</Badge>);

    return badges;
  };

  const handleNavigate = id => navigate(`/visualizar/${id}`);

  return (
    <div>
      <NavBar />

      <Container style={{ marginTop: "150px" }}>
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
                  className={`h-100 shadow-sm ${darkMode ? styles.cardDark : styles.cardLight} ${styles.card}`}
                  style={{
                    backgroundColor: getCorDeFundo(insumo.tipoEstoque, insumo.tipoValidade),
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
                        <div className="d-flex flex-wrap">{getBadge(insumo)}</div>
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
