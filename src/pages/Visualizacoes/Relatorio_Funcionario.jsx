import { useState, useEffect } from 'react';
import { Container, Form, Button, FloatingLabel } from 'react-bootstrap';
import NavBar from '../../components/NavBar/NavBar';
import { useParams, useNavigate } from 'react-router';

const Relatorio_Funcionario = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [funcionario, setFuncionario] = useState({
    nome_funcionario: '',
    email_funcionario: '',
    cargo_funcionario: '',
    imagem_url: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:3000/funcionarios/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Funcionário não encontrado');
        return res.json();
      })
      .then(data => {
        const raw = Array.isArray(data) ? data[0] : data;
        setFuncionario({
          nome_funcionario: raw.nome_funcionario || '',
          email_funcionario: raw.email_funcionario || '',
          cargo_funcionario: raw.cargo_funcionario || '',
          imagem_url: raw.imagem_url || '',
        });
      })
      .catch(err => {
        console.error('Erro ao carregar funcionário:', err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFuncionario(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:3000/AtualizarFuncionario/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(funcionario),
      });

      if (!res.ok) throw new Error('Erro ao atualizar funcionário.');

      alert('Funcionário atualizado com sucesso!');
      navigate('/funcionarios');
    } catch (err) {
      alert(err.message);
    }
  };

  const imagemLink = funcionario.imagem_url?.trim()
    ? `${funcionario.imagem_url}?t=${Date.now()}`
    : 'https://www.freeiconspng.com/thumbs/no-image-icon/no-image-icon-6.png';

  if (loading) return <p>Carregando funcionário...</p>;
  if (error) return <p>Erro: {error}</p>;

  return (
    <div style={{ marginTop: '100px' }}>
      <NavBar />
      <Container style={{ maxWidth: '600px' }}>
        <Form onSubmit={handleSubmit} className="shadow p-4 rounded" style={{ border: '1px solid #007bff' }}>
          <h2 className="text-center mb-4">Editar Funcionário</h2>

          <FloatingLabel label="Nome" className="mb-3">
            <Form.Control
              name="nome_funcionario"
              type="text"
              value={funcionario.nome_funcionario}
              onChange={handleChange}
              required
            />
          </FloatingLabel>

          <FloatingLabel label="Email" className="mb-3">
            <Form.Control
              name="email_funcionario"
              type="email"
              value={funcionario.email_funcionario}
              onChange={handleChange}
              required
            />
          </FloatingLabel>

          <FloatingLabel label="Cargo" className="mb-3">
            <Form.Control
              name="cargo_funcionario"
              type="text"
              value={funcionario.cargo_funcionario}
              onChange={handleChange}
              required
            />
          </FloatingLabel>

          <FloatingLabel label="URL da Imagem" className="mb-3">
            <Form.Control
              name="imagem_url"
              type="text"
              value={funcionario.imagem_url}
              onChange={handleChange}
            />
          </FloatingLabel>

          <div className="text-center mb-3">
            <img
              src={imagemLink}
              alt="Imagem do Funcionário"
              style={{ maxHeight: '250px', objectFit: 'contain' }}
              className="img-fluid rounded"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://www.freeiconspng.com/thumbs/no-image-icon/no-image-icon-6.png';
              }}
            />
          </div>

          <Button type="submit" className="w-100 mb-2" style={{ padding: '12px', borderRadius: '30px' }}>
            Salvar Alterações
          </Button>

          <Button
            variant="outline-primary"
            onClick={() => navigate('/funcionarios')}
            className="w-100"
            style={{ padding: '12px', borderRadius: '30px' }}
          >
            Cancelar
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default Relatorio_Funcionario;