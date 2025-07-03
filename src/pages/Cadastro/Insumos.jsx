import { useState, useEffect } from 'react';
import '../Style/login.css';
import NavBar from '../../components/NavBar/NavBar';
import { Button, Container, Dropdown, FloatingLabel, Form, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router';

import logo from "../../assets/logo.png"

const getFormDataInicial = () => ({
  nome_insumos: '',
  valor_insumos: '',
  categoria: 'Categoria',
  unidade_medida: 'unidade',
  quantidade_insumos: 0,
  data_vencimento: '',
  descricao_insumos: '',
  imagem: null,
  alertar_dias_antes: 10,
  alerta_estoque: 1,
  fornecedor_id: null
});

const categoriasDisponiveis = ['Carnes', 'Perecíveis', 'Molhos', 'Congelados'];
const unidadesDisponiveis = ['unidade', 'kg', 'litro', 'g', 'ml'];

const Insumos = () => {
  const [formData, setFormData] = useState(getFormDataInicial());
  const [showModalFornecedor, setShowModalFornecedor] = useState(false);
  const [fornecedor, setFornecedor] = useState({ nome: '', telefone: '', email: '' });
  const [fornecedores, setFornecedores] = useState([]);
  const navigate = useNavigate();
  const [imagemFile, setImagemFile] = useState(null);
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const buscarFornecedores = async () => {
      try {
        const res = await fetch('http://localhost:3000/fornecedores');
        const data = await res.json();
        setFornecedores(data);
      } catch (error) {
        console.error('Erro ao buscar fornecedores:', error);
      }
    };

    buscarFornecedores();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const camposNumericos = ['quantidade_insumos', 'valor_insumos', 'alertar_dias_antes', 'alerta_estoque'];

    setFormData((prev) => ({
      ...prev,
      [name]: camposNumericos.includes(name) ? Number(value) : value
    }));
  };

  const handleFornecedorChange = (e) => {
    const { name, value } = e.target;
    const novoValor = name === 'telefone' ? formatarTelefone(value) : value;

    setFornecedor((prev) => ({ ...prev, [name]: novoValor }));
  };

  const validarInsumos = () => {
    if (formData.nome_insumos.length < 3) return alert('O nome do insumo deve ter pelo menos 3 caracteres.');
    if (formData.valor_insumos <= 0) return alert('O valor por unidade deve ser maior que zero.');
    if (formData.quantidade_insumos < 0) return alert('A quantidade em estoque não pode ser negativa.');
    if (!formData.data_vencimento || new Date(formData.data_vencimento) < new Date(today))
      return alert('A data de validade deve ser hoje ou uma data futura.');
    if (!imagemFile) return alert('A imagem do insumo é obrigatória.');
    if (formData.alertar_dias_antes < 0) return alert('O número de dias para alerta deve ser igual ou maior que 0.');
    if (formData.alerta_estoque < 1) return alert('O alerta de estoque deve ser maior que 0.');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarInsumos()) return;

    try {
      const formDataEnvio = new FormData();
      formDataEnvio.append('nome_insumos', formData.nome_insumos);
      formDataEnvio.append('valor_insumos', formData.valor_insumos);
      formDataEnvio.append('categoria', formData.categoria);
      formDataEnvio.append('unidade_medida', formData.unidade_medida);
      formDataEnvio.append('quantidade_insumos', formData.quantidade_insumos);
      formDataEnvio.append('data_vencimento', formData.data_vencimento);
      formDataEnvio.append('descricao_insumos', formData.descricao_insumos);
      formDataEnvio.append('alerta_estoque', formData.alerta_estoque);
      formDataEnvio.append('alertar_dias_antes', formData.alertar_dias_antes);
      formDataEnvio.append('fornecedor_id', formData.fornecedor_id ?? null);
      formDataEnvio.append('imagem', imagemFile);

      const res = await fetch("http://localhost:3000/insumos/insert", {
        method: "POST",
        body: formDataEnvio
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

  const handleSalvarFornecedor = async () => {
    const telefoneLimpo = fornecedor.telefone.replace(/\D/g, '');

    if (telefoneLimpo.length < 10 || telefoneLimpo.length > 11) {
      alert('Digite um número de telefone válido (com DDD).');
      return;
    }

    if (!fornecedor.nome.trim()) {
      alert('O nome do fornecedor é obrigatório.');
      return;
    }

    if (fornecedor.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fornecedor.email)) {
      alert('Digite um e-mail válido ou deixe em branco.');
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/cadastro/fornecedor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fornecedor)
      });

      if (res.ok) {
        alert('Fornecedor cadastrado com sucesso!');
        setShowModalFornecedor(false);
        setFornecedor({ nome: '', telefone: '', email: '' });
        const novaLista = await fetch('http://localhost:3000/fornecedores');
        setFornecedores(await novaLista.json());
      } else {
        const erro = await res.json();
        alert(erro.error || 'Erro ao cadastrar fornecedor.');
      }
    } catch (error) {
      console.error('Erro ao salvar fornecedor:', error);
      alert('Erro de rede ou servidor.');
    }
  };

  const formatarTelefone = (valor) => {
    const numero = valor.replace(/\D/g, '');
    if (numero.length <= 2) return numero;
    if (numero.length <= 6) return `(${numero.slice(0, 2)}) ${numero.slice(2)}`;
    if (numero.length <= 10) return `(${numero.slice(0, 2)}) ${numero.slice(2, 6)}-${numero.slice(6)}`;
    return `(${numero.slice(0, 2)}) ${numero.slice(2, 7)}-${numero.slice(7, 11)}`;
  };

  return (
    <div style={{ marginTop: '100px', marginBottom: "20px" }}>
      <NavBar />
      <Container style={{ maxWidth: "800px" }}>
        <Form onSubmit={handleSubmit} className="shadow rounded" style={{ padding: '30px', border: '1px blue solid', textAlign:"center" }}>
          <img src={logo} width={100} alt="logo" className="me-2" />
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

          <FloatingLabel controlId="valor_insumos" label="Valor do insumo" className="m-2">
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

          <FloatingLabel controlId="alertar_dias_antes" label="Alertar quantos dias antes do vencimento?" className="m-2">
            <Form.Control
              type="number"
              name="alertar_dias_antes"
              min="0"
              value={formData.alertar_dias_antes}
              onChange={handleChange}
              className="rounded-3 shadow mt-3"
              required
            />
          </FloatingLabel>

          <Form.Group className="m-2">
            <Form.Label>Imagem do Insumo</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) => setImagemFile(e.target.files[0])}
              className="rounded-3 shadow"
              required
            />
          </Form.Group>

          <Form.Group className="m-2">
            <Dropdown className="shadow rounded-3">
              <Dropdown.Toggle variant="outline-primary rounded-3" style={{ width: '100%' }}>
                {formData.unidade_medida}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {unidadesDisponiveis.map((unidade) => (
                  <Dropdown.Item
                    key={unidade}
                    onClick={() =>
                      setFormData(prev => ({
                        ...prev,
                        unidade_medida: unidade
                      }))
                    }
                  >
                    {unidade}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Form.Group>

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

          <Form.Group className="m-2">
            <Dropdown className="shadow rounded-3">
              <Dropdown.Toggle variant="outline-primary rounded-3" style={{ width: '100%' }}>
                {formData.fornecedor_id ? (
                  fornecedores.find(f => f.id_fornecedor === formData.fornecedor_id)?.nome_fornecedor
                ) : 'Sem fornecedor relacionado'}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {fornecedores.map(f => (
                  <Dropdown.Item
                    key={f.id_fornecedor}
                    onClick={() => setFormData({ ...formData, fornecedor_id: f.id_fornecedor })}
                  >
                    {f.nome_fornecedor}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Form.Group>

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

          <div className="d-flex m-2 align-items-center gap-2">
            <Dropdown className="shadow rounded-3 mt-2">
              <Dropdown.Toggle variant="outline-primary rounded-3">
                {formData.categoria}
              </Dropdown.Toggle>
              <Dropdown.Menu className="rounded-3">
                {categoriasDisponiveis.map((item) => (
                  <Dropdown.Item
                    key={item}
                    onClick={() => setFormData({ ...formData, categoria: item })}
                  >
                    {item}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>

            <Button variant="outline-success" className="mt-2" onClick={() => setShowModalFornecedor(true)}>
              Cadastrar Fornecedor
            </Button>
          </div>

          <div className="d-flex justify-content-center gap-3" style={{ width: "95%", margin: "auto" }}>
            <Button type="submit" className="shadow mt-4 rounded" style={{ padding: '15px', width: '50%' }}>
              Cadastrar
            </Button>
            <Button variant="outline-danger" onClick={() => navigate('/estoque')} className="shadow mt-4 rounded" style={{ padding: '15px', width: '50%' }}>
              Cancelar
            </Button>
          </div>
        </Form>
      </Container>

      <Modal show={showModalFornecedor} onHide={() => setShowModalFornecedor(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Cadastrar Fornecedor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FloatingLabel controlId="nome_fornecedor" label="Nome do Fornecedor" className="mb-3">
            <Form.Control
              type="text"
              name="nome"
              value={fornecedor.nome}
              onChange={handleFornecedorChange}
              required
            />
          </FloatingLabel>
          <FloatingLabel controlId="telefone_fornecedor" label="Telefone" className="mb-3">
            <Form.Control
              type="text"
              name="telefone"
              value={fornecedor.telefone}
              onChange={handleFornecedorChange}
            />
          </FloatingLabel>
          <FloatingLabel controlId="email_fornecedor" label="Email" className="mb-3">
            <Form.Control
              type="email"
              name="email"
              value={fornecedor.email}
              onChange={handleFornecedorChange}
            />
          </FloatingLabel>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModalFornecedor(false)}>
            Fechar
          </Button>
          <Button variant="primary" onClick={handleSalvarFornecedor}>
            Salvar Fornecedor
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Insumos;