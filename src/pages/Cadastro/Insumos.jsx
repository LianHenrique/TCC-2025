import { useState } from 'react';
import '../Style/login.css';
import NavBar from '../../components/NavBar/NavBar';
import { Button, Container, Dropdown, FloatingLabel, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router';

const Insumos = () => {
  // Estados do formulário
  const [formData, setFormData] = useState({
    nome_insumos: '',
    valor_insumos: '',
    categoria: 'Categoria',
    quantidade_insumos: 0,
    data_vencimento: '',
    descricao_insumos: '',
    imagem_url: ''
  });

  // Opções de categoria conforme ENUM do banco
  const categoriasDisponiveis = ['Carnes', 'Perecíveis', 'Molhos', 'Congelados'];
  
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];

  // Manipulador de mudança genérico para todos os campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantidade_insumos' ? Number(value) : value
    }));
  };

  // Manipulador de envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação dos campos obrigatórios
    if (Object.values(formData).some(val => 
      val === '' || 
      (typeof val === 'number' && isNaN(val))
    )) {
      alert('Todos os campos são obrigatórios.');
      return;
    }

    // Validação da data de vencimento
    if (new Date(formData.data_vencimento) < new Date(today)) {
      alert('A data de validade deve ser hoje ou uma data futura.');
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/insumos/insert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Insumo cadastrado com sucesso!");
        // Reset do formulário
        setFormData({
          nome_insumos: '',
          valor_insumos: '',
          categoria: 'Outros',
          quantidade_insumos: 0,
          data_vencimento: '',
          descricao_insumos: '',
          imagem_url: ''
        });
        navigate('/estoque');
      } else {
        alert("Erro ao cadastrar insumo.");
      }
    } catch (error) {
      console.error("Erro de rede ou servidor", error);
      alert("Erro de rede ou servidor.");
    }
  };

  // Reset do formulário
  const handleReset = () => {
    setFormData({
      nome_insumos: '',
      valor_insumos: '',
      categoria: 'Outros',
      quantidade_insumos: 0,
      data_vencimento: '',
      descricao_insumos: '',
      imagem_url: ''
    });
  };

  //valida insumos
  const validarInsumos = () =>{
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
    if (!formData.data_vencimento) {
      alert('A data de validade é obrigatória.');
      return false;
    }
    if (new Date(formData.data_vencimento) < new Date(today)) {
      alert('A data de validade deve ser hoje ou uma data futura.');
      return false;
    }
    if (!formData.imagem_url) {
      alert('A URL da imagem é obrigatória.');
      return false;
    }
    if (formData.descricao_insumos.length < 10) {
      alert('A descrição do produto deve ter pelo menos 10 caracteres.');
      return false;
    }
    return true;
  }

  return (
    <div style={{ marginTop: '100px' }}>
      <NavBar />
      <Container style={{ maxWidth: "800px" }}>
        <Form
          onSubmit={handleSubmit}
          className="shadow"
          style={{
            padding: '30px',
            borderRadius: '20px',
            border: '1px blue solid',
            marginBottom: "10px"
          }}
        >
          <h1 style={{ textAlign: 'center' }}>Cadastro de Insumos</h1>

          <FloatingLabel controlId="nome_insumos" label="Nome do Insumo" className="m-2">
            <Form.Control
              type="text"
              name="nome_insumos"
              placeholder="Nome do Insumo"
              value={formData.nome_insumos}
              onChange={handleChange}
              className="rounded-5 shadow mt-3"
              style={{ border: 'none' }}
              required
            />
          </FloatingLabel>

          <FloatingLabel controlId="valor_insumos" label="Valor por Unidade" className="m-2">
            <Form.Control
              type="number"
              name="valor_insumos"
              step="0.01"
              min="0"
              placeholder="Valor por Unidade"
              value={formData.valor_insumos}
              onChange={handleChange}
              className="rounded-5 shadow mt-3"
              style={{ border: 'none' }}
              required
            />
          </FloatingLabel>

          <FloatingLabel controlId="data_vencimento" label="Data de Validade" className="m-2">
            <Form.Control
              type="date"
              name="data_vencimento"
              placeholder="Data de Validade"
              value={formData.data_vencimento}
              min={today}
              onChange={handleChange}
              className="rounded-5 shadow mt-3"
              style={{ border: 'none' }}
              required
            />
          </FloatingLabel>

          <FloatingLabel controlId="quantidade_insumos" label="Quantidade em Estoque" className="m-2">
            <Form.Control
              type="number"
              name="quantidade_insumos"
              min="0"
              placeholder="Quantidade em Estoque"
              value={formData.quantidade_insumos}
              onChange={handleChange}
              className="rounded-5 shadow mt-3"
              style={{ border: 'none' }}
              required
            />
          </FloatingLabel>

          <FloatingLabel controlId="imagem_url" label="URL da Imagem" className="m-2">
            <Form.Control
              type="text"
              name="imagem_url"
              placeholder="URL da Imagem"
              value={formData.imagem_url}
              onChange={handleChange}
              className="rounded-5 shadow mt-3"
              style={{ border: 'none' }}
              required
            />
          </FloatingLabel>

          <FloatingLabel controlId="descricao_insumos" label="Descrição do Produto" className="m-2">
            <Form.Control
              as="textarea"
              name="descricao_insumos"
              placeholder="Descrição do Produto"
              value={formData.descricao_insumos}
              onChange={handleChange}
              className="rounded-5 shadow mt-3"
              style={{ border: 'none', height: '100px' }}
              required
            />
          </FloatingLabel>

          <div className="d-flex m-2" style={{ alignContent: 'center' }}>
            <Dropdown className="d-flex shadow rounded-5 mt-2" style={{ width: '150px', height: '60px' }}>
              <Dropdown.Toggle
                variant="outline-primary rounded-5"
                style={{ width: '150px', height: '60px' }}
              >
                {formData.categoria}
              </Dropdown.Toggle>
              <Dropdown.Menu className="rounded-3">
                {categoriasDisponiveis.map((item) => (
                  <Dropdown.Item
                    key={item}
                    onClick={() => setFormData({...formData, categoria: item})}
                    className="dropdown-item rounded-5"
                  >
                    {item}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
            <Button
              className="rounded-5 m-2 mt-2 fs-2"
              style={{ width: '60px', height: '60px' }}
              onClick={handleReset}
              variant="outline-danger"
            >
              ↺
            </Button>
          </div>

          <div className="d-flex justify-content-center gap-3">
            <Button
              type="submit"
              className="shadow mt-4"
              style={{
                padding: '15px',
                width: '45%',
                borderRadius: '30px'
              }}
            >
              Cadastrar
            </Button>
            <Button
              className="shadow mt-4"
              variant="outline-primary"
              onClick={() => navigate('/estoque')}
              style={{
                padding: '15px',
                width: '45%',
                borderRadius: '30px'
              }}
            >
              Cancelar
            </Button>
          </div>
        </Form>
      </Container>
    </div>
  );
};

export default Insumos;