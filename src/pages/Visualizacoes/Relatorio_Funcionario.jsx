import { useState, useEffect } from 'react';
import { Container, Form, Button, FloatingLabel, Dropdown, Alert, Spinner } from 'react-bootstrap';
import NavBar from '../../components/NavBar/NavBar';
import { useParams, useNavigate } from 'react-router';

const Relatorio_Funcionario = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome_funcionario: '',
    email_funcionario: '',
    imagem_url: '',
    cargo_funcionario: 'Cargo',
  });

  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ tipo: '', mensagem: '' });

  // Lista de cargos compatíveis com o ENUM do banco
  const cargosDisponiveis = ['ADM', 'Gerente', 'Funcionario'];

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:3000/funcionarios/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Funcionário não encontrado');
        return res.json();
      })
      .then(data => {
        const raw = Array.isArray(data) ? data[0] : data;
        setForm({
          nome_funcionario: raw.nome_funcionario || '',
          email_funcionario: raw.email_funcionario || '',
          imagem_url: raw.imagem_url || '',
          cargo_funcionario: raw.cargo_funcionario || 'Cargo',
        });
      })
      .catch(err => {
        setFeedback({ tipo: 'danger', mensagem: err.message });
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { nome_funcionario, email_funcionario, imagem_url, cargo_funcionario } = form;

    if (
      !nome_funcionario.trim() ||
      !email_funcionario.trim() ||
      !imagem_url.trim() ||
      cargo_funcionario === 'Cargo'
    ) {
      setFeedback({ tipo: 'danger', mensagem: 'Preencha todos os campos obrigatórios.' });
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/AtualizarFuncionario/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Erro ao atualizar funcionário.');

      setFeedback({ tipo: 'success', mensagem: 'Funcionário atualizado com sucesso!' });

      setTimeout(() => navigate('/funcionarios'), 1500);
    } catch (err) {
      setFeedback({ tipo: 'danger', mensagem: err.message });
    }
  };

  const imagemLink = form.imagem_url?.trim()
    ? `${form.imagem_url}?t=${Date.now()}`
    : 'https://www.freeiconspng.com/thumbs/no-image-icon/no-image-icon-6.png';

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Carregando funcionário...</p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '100px' }}>
      <NavBar />
      <Container style={{ maxWidth: '600px' }}>
        <Form onSubmit={handleSubmit} className="shadow p-4 rounded" style={{ border: '1px solid #007bff' }}>
          <h2 className="text-center mb-4">Editar Funcionário</h2>

          {feedback.mensagem && (
            <Alert variant={feedback.tipo} onClose={() => setFeedback({ tipo: '', mensagem: '' })} dismissible>
              {feedback.mensagem}
            </Alert>
          )}

          <FloatingLabel label="Nome" className="mb-3">
            <Form.Control
              name="nome_funcionario"
              type="text"
              value={form.nome_funcionario}
              onChange={handleChange}
              required
            />
          </FloatingLabel>

          <FloatingLabel label="Email" className="mb-3">
            <Form.Control
              name="email_funcionario"
              type="email"
              value={form.email_funcionario}
              onChange={handleChange}
              required
            />
          </FloatingLabel>

          <FloatingLabel label="URL da Imagem" className="mb-3">
            <Form.Control
              name="imagem_url"
              type="text"
              value={form.imagem_url}
              onChange={handleChange}
              required
            />
          </FloatingLabel>

          <div className="d-flex justify-content-center mb-3">
            <Dropdown style={{ width: '150px', height: '60px' }}>
              <Dropdown.Toggle variant="outline-primary rounded" style={{ width: '150px', height: '60px' }}>
                {form.cargo_funcionario}
              </Dropdown.Toggle>
              <Dropdown.Menu className="rounded-3">
                {cargosDisponiveis.map((cargo) => (
                  <Dropdown.Item
                    key={cargo}
                    onClick={() => setForm(prev => ({ ...prev, cargo_funcionario: cargo }))}
                    className="dropdown-item rounded"
                  >
                    {cargo}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>

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