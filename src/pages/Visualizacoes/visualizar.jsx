import { useState, useEffect } from 'react';
import '../Style/login.css';
import NavBar from '../../components/NavBar/NavBar';
import { Button, Container, FloatingLabel, Form, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import { AuthContext } from '../../Contexts/UserContext';
import { useContext } from 'react';

const Visualizar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cargoUsuario, isloading } = useContext(AuthContext);
  const [nome, setNome] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [filtro, setFiltro] = useState('');
  const [url, setUrl] = useState('');
  const [validade, setValidade] = useState('');
  const [preco, setPreco] = useState('');
  const [imagemAtual, setImagemAtual] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alertaEstoque, setAlertaEstoque] = useState('');
  const [alertaVencimento, setAlertaVencimento] = useState('');
  const [fornecedores, setFornecedores] = useState([]);
  const [idFornecedor, setIdFornecedor] = useState(null);
  const [unidade, setUnidade] = useState('');
  const [fileImagem, setFileImagem] = useState(null);
  const isRestrito = !isloading && cargoUsuario === 'Funcionario';
  const unidadesDisponiveis = ['unidade', 'kg', 'g', 'litro', 'ml'];

  useEffect(() => {
    if (!isloading && cargoUsuario === 'Funcionario') {
      console.warn('Acesso limitado para funcionários.');
    }
  }, [isloading, cargoUsuario]);

  useEffect(() => {
    fetch('http://localhost:3000/fornecedores')
      .then((res) => res.json())
      .then((data) => setFornecedores(data))
      .catch((err) => console.error('Erro ao buscar fornecedores:', err));
  }, []);

  // Função para obter a URL completa da imagem
  const getImagemUrl = (path) => {
    if (!path) return '';

    // Se já é URL completa
    if (path.startsWith('http')) {
      return path;
    }

    // Extrair apenas o nome do arquivo
    const extractFilename = (p) => {
      return p
        .replace(/^.*[\\\/]/, '') // Remove tudo até a última barra
        .replace(/\?.*$/, ''); // Remove parâmetros de query se houver
    };

    const filename = extractFilename(path);
    return `http://localhost:3000/uploads/${filename}`;
  };

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:3000/insumos_tudo/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Produto não encontrado');
        return res.json();
      })
      .then(data => {
        const insumo = Array.isArray(data) ? data[0] : data;

        setNome(insumo.nome_insumos);
        setQuantidade(insumo.quantidade_insumos);
        setPreco(insumo.valor_insumos);
        setUrl(insumo.imagem_url);
        setImagemAtual(insumo.imagem_url);
        setFiltro(insumo.categoria);
        setAlertaEstoque(insumo.alerta_estoque || '');
        setAlertaVencimento(insumo.alertar_dias_antes ?? '');
        setIdFornecedor(insumo.id_fornecedor || null);
        setUnidade(insumo.unidade_medida || 'unidade');

        const dataFormatada = insumo.data_vencimento
          ? new Date(insumo.data_vencimento).toISOString().split('T')[0]
          : '';
        setValidade(dataFormatada);

        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('nome_insumos', nome);
      formData.append('quantidade_insumos', quantidade);
      formData.append('categoria', filtro);
      formData.append('valor_insumos', preco);
      formData.append('data_vencimento', validade);
      formData.append('alerta_estoque', alertaEstoque);
      formData.append(
        'alertar_dias_antes',
        alertaVencimento !== '' ? parseInt(alertaVencimento, 10) : ''
      );
      formData.append('unidade_medida', unidade);
      formData.append('id_fornecedor', idFornecedor || '');

      if (fileImagem) {
        formData.append('imagem', fileImagem);
      } else {
        formData.append('imagem_atual', imagemAtual);
      }

      const response = await fetch(`http://localhost:3000/insumos_tudo_POST/${id}`, {
        method: 'PUT',
        body: formData
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao atualizar insumo');
      }

      alert('Insumo atualizado com sucesso!');
      navigate('/estoque');
    } catch (error) {
      alert(`Erro: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status" />
        <p className="mt-3">Carregando insumo...</p>
      </div>
    );
  }

  if (error) return <p className="text-danger text-center mt-5">{error}</p>;

  return (
    <div style={{ marginTop: '100px' }}>
      <NavBar />
      <Container style={{ maxWidth: '800px' }}>
        <Form
          onSubmit={handleSubmit}
          className="shadow"
          style={{
            padding: '30px',
            borderRadius: '20px',
            border: '1px solid blue',
            marginBottom: '10px'
          }}
        >
          <h1 style={{ textAlign: 'center' }}>Editar Insumo</h1>

          <FloatingLabel controlId="nome" label="Nome" className="mb-3">
            <Form.Control
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="rounded-5 shadow"
              required
            />
          </FloatingLabel>

          <FloatingLabel controlId="quantidade" label="Quantidade" className="mb-3">
            <Form.Control
              type="number"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              className="rounded-5 shadow"
              min="0"
              required
            />
          </FloatingLabel>

          <FloatingLabel controlId="unidade" className="mb-3">
            <Dropdown className="shadow rounded-5" style={{ width: '100%' }}>
              <Dropdown.Toggle
                variant="outline-primary"
                className="rounded-5"
                style={{ width: '100%', textAlign: 'left' }}
              >
                {unidade}
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ width: '100%' }}>
                {['unidade', 'kg', 'litro', 'g', 'ml'].map((u) => (
                  <Dropdown.Item key={u} onClick={() => setUnidade(u)}>
                    {u}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </FloatingLabel>

          <FloatingLabel controlId="validade" label="Validade" className="mb-3">
            <Form.Control
              type="date"
              placeholder="Validade"
              value={validade}
              onChange={(e) => setValidade(e.target.value)}
              className="rounded-5 shadow"
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </FloatingLabel>

          <FloatingLabel controlId="alertaEstoque" label="Alerta de Estoque (mínimo)" className="mb-3">
            <Form.Control
              type="number"
              value={alertaEstoque}
              onChange={(e) => setAlertaEstoque(e.target.value)}
              className="rounded-5 shadow"
              min="0"
              required
            />
          </FloatingLabel>

          <FloatingLabel controlId="alertaVencimento" label="Alerta de Vencimento (dias antes)" className="mb-3">
            <Form.Control
              type="number"
              value={alertaVencimento}
              onChange={(e) => setAlertaVencimento(e.target.value)}
              className="rounded-5 shadow"
              min="0"
              required
            />
          </FloatingLabel>

          <FloatingLabel controlId="categoria" label="Categoria" className="mb-3">
            <Form.Select
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="rounded-5 shadow"
              required
            >
              <option value="Carnes">Carnes</option>
              <option value="Perecíveis">Perecíveis</option>
              <option value="Molhos">Molhos</option>
              <option value="Congelados">Congelados</option>
            </Form.Select>
          </FloatingLabel>

          <FloatingLabel controlId="fornecedor" label="Fornecedor" className="mb-3">
            <Form.Select
              value={idFornecedor || ''}
              onChange={(e) => setIdFornecedor(e.target.value)}
              className="rounded-5 shadow"
            >
              <option value="">Não relacionado</option>
              {fornecedores.map((f) => (
                <option key={f.id_fornecedor} value={f.id_fornecedor}>
                  {f.nome_fornecedor}
                </option>
              ))}
            </Form.Select>
          </FloatingLabel>

          <FloatingLabel controlId="imagem" label="Nova Imagem" className="mb-3">
            <Form.Control
              type="file"
              accept="image/*"
              className="rounded-5 shadow"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setUrl(URL.createObjectURL(file)); // Visualização temporária
                  setFileImagem(file);               // Para enviar ao backend
                }
              }}
            />
          </FloatingLabel>

          <div className="text-center mb-4">
            <img
              src={
                fileImagem
                  ? URL.createObjectURL(fileImagem)
                  : imagemAtual
                    ? getImagemUrl(imagemAtual) // Usar a função corrigida aqui
                    : 'https://www.valuehost.com.br/blog/wp-content/uploads/2022/01/post_thumbnail-77d8f2a95f2f41b5863f3fba5a261d7e.jpeg.webp'
              }
              alt="Imagem do insumo"
              style={{
                maxWidth: '300px',
                width: '100%',
                height: 'auto',
                borderRadius: '10px',
                boxShadow: '0 0 10px rgba(0,0,0,0.2)'
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  'https://www.valuehost.com.br/blog/wp-content/uploads/2022/01/post_thumbnail-77d8f2a95f2f41b5863f3fba5a261d7e.jpeg.webp';
              }}
            />
          </div>

          <Button
            type="submit"
            className="shadow mt-4"
            style={{ padding: '15px', width: '100%', borderRadius: '30px' }}
          >
            Confirmar Alterações
          </Button>

          <Button
            variant="outline-primary"
            onClick={() => navigate('/estoque')}
            className="shadow mt-2"
            style={{ padding: '15px', width: '100%', borderRadius: '30px' }}
          >
            Cancelar
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default Visualizar;
