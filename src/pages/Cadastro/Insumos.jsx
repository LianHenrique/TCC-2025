import { useState } from 'react';
import '../Style/login.css';
import NavBar from '../../components/NavBar/NavBar';
import { Button, Container, Dropdown, FloatingLabel, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router';

const getFormDataInicial = () => ({
  nome_insumos: '',
  valor_insumos: '',
  categoria: 'Categoria',
  quantidade_insumos: 0,
  data_vencimento: '',
  descricao_insumos: '',
  imagem_url: '',
  alerta_vencimento: 10, // dias antes do vencimento
  alerta_estoque: 1 // mínimo para alerta de estoque
});

const categoriasDisponiveis = ['Carnes', 'Perecíveis', 'Molhos', 'Congelados'];

const Insumos = () => {
  const [formData, setFormData] = useState(getFormDataInicial());
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ['quantidade_insumos', 'valor_insumos', 'alerta_vencimento', 'alerta_estoque'].includes(name)
        ? Number(value)
        : value
    }));
  };

  const validarInsumos = () => {
    if (formData.nome_insumos.length < 3) {
      alert('O nome do insumo deve ter pelo menos 3 caracteres.');
      return false;
    }
    if (formData.valor_insumos <= 0) {
      alert('O valor por unidade deve ser maior que zero.');
      return false;
    }
    if (formData.quantidade_insumos < 0) {
      alert('A quantidade em estoque não pode ser negativa.');
      return false;
    }
    if (!formData.data_vencimento || new Date(formData.data_vencimento) < new Date(today)) {
      alert('A data de validade deve ser hoje ou uma data futura.');
      return false;
    }
    if (!formData.imagem_url) {
      alert('A URL da imagem é obrigatória.');
      return false;
    }
    if (formData.alerta_vencimento < 0) {
      alert('O número de dias para alerta deve ser igual ou maior que 0.');
      return false;
    }
    if (formData.alerta_estoque < 1) {
      alert('O alerta de estoque deve ser maior que 0.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarInsumos()) return;

    try {
      const res = await fetch("http://localhost:3000/insumos/insert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        alert("Insumo cadastrado com sucesso!");
        setFormData(getFormDataInicial());
        navigate('/estoque');
      } else {
        alert("Erro ao cadastrar insumo.");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro de rede ou servidor.");
    }
  };

  return (
    <div style={{ marginTop: '100px' }}>
      <NavBar />
      <Container style={{ maxWidth: "500px" }}>
        <Form onSubmit={handleSubmit} className="shadow rounded" style={{ padding: '30px', border: '1px blue solid' }}>
          <h1 className="text-center">Cadastro de Insumos</h1>

          <FloatingLabel controlId="nome_insumos" label="Nome do Insumo" className="m-2">
            <Form.Control
              type="text"
              name="nome_insumos"
              value={formData.nome_insumos}
              onChange={handleChange}
              className="rounded-3 shadow mt-3"
              required
            />
          </FloatingLabel>

          <FloatingLabel controlId="valor_insumos" label="Valor por Unidade" className="m-2">
            <Form.Control
              type="number"
              name="valor_insumos"
              step="0.01"
              min="0"
              value={formData.valor_insumos}
              onChange={handleChange}
              className="rounded-3 shadow mt-3"
              required
            />
          </FloatingLabel>

          <FloatingLabel controlId="data_vencimento" label="Data de Validade" className="m-2">
            <Form.Control
              type="date"
              name="data_vencimento"
              value={formData.data_vencimento}
              min={today}
              onChange={handleChange}
              className="rounded-3 shadow mt-3"
              required
            />
          </FloatingLabel>

          <FloatingLabel controlId="alerta_vencimento" label="Alertar quantos dias antes do vencimento?" className="m-2">
            <Form.Control
              type="number"
              name="alerta_vencimento"
              min="0"
              value={formData.alerta_vencimento}
              onChange={handleChange}
              className="rounded-3 shadow mt-3"
              required
            />
          </FloatingLabel>

          <FloatingLabel controlId="quantidade_insumos" label="Quantidade em Estoque" className="m-2">
            <Form.Control
              type="number"
              name="quantidade_insumos"
              min="1"
              value={formData.quantidade_insumos}
              onChange={handleChange}
              className="rounded-3 shadow mt-3"
              required
            />
          </FloatingLabel>

          <FloatingLabel controlId="alerta_estoque" label="Alertar com qual quantidade em estoque?" className="m-2">
            <Form.Control
              type="number"
              name="alerta_estoque"
              min="1"
              value={formData.alerta_estoque}
              onChange={handleChange}
              className="rounded-3 shadow mt-3"
              required
            />
          </FloatingLabel>

          <FloatingLabel controlId="imagem_url" label="URL da Imagem" className="m-2">
            <Form.Control
              type="text"
              name="imagem_url"
              value={formData.imagem_url}
              onChange={handleChange}
              className="rounded-3 shadow mt-3"
              required
            />
          </FloatingLabel>

          <FloatingLabel controlId="descricao_insumos" label="Descrição do Produto" className="m-2">
            <Form.Control
              as="textarea"
              name="descricao_insumos"
              value={formData.descricao_insumos}
              onChange={handleChange}
              className="rounded-3 shadow mt-3"
              style={{ height: '100px' }}
              required
            />
          </FloatingLabel>

          <div className="d-flex m-2">
            <Dropdown className="d-flex shadow rounded-3 mt-2" style={{ width: '150px', height: '60px' }}>
              <Dropdown.Toggle variant="outline-primary rounded-3" style={{ width: '150px', height: '60px' }}>
                {formData.categoria}
              </Dropdown.Toggle>
              <Dropdown.Menu className="rounded-3">
                {categoriasDisponiveis.map((item) => (
                  <Dropdown.Item
                    key={item}
                    onClick={() => setFormData({ ...formData, categoria: item })}
                    className="rounded-3"
                  >
                    {item}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>

          <div className="d-flex justify-content-center gap-3" style={{ width: "95%", margin: "auto" }}>
            <Button type="submit" className="shadow mt-4 rounded" style={{ padding: '15px', width: '50%' }}>
              Cadastrar
            </Button>
            <Button variant="outline-primary" onClick={() => navigate('/estoque')} className="shadow mt-4 rounded" style={{ padding: '15px', width: '50%' }}>
              Cancelar
            </Button>
          </div>
        </Form>
      </Container>
    </div>
  );
};

export default Insumos;
