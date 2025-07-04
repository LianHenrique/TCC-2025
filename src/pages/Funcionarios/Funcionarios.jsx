import { Container } from 'react-bootstrap';
import NavBar from '../../components/NavBar/NavBar';
import Pesquisa from '../../components/Pesquisa/Pesquisa';
import CardGeral from '../../components/Cards/CardGeral';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { FaEdit, FaRegTrashAlt } from 'react-icons/fa';

const Funcionarios = () => {
  const [todosFuncionarios, setTodosFuncionarios] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [filtro, setFiltro] = useState({ texto: '', cargo: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const removerAcentos = (texto) => {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  // Busca os funcionários ao montar o componente
  useEffect(() => {
    fetch('http://localhost:3000/funcionarios')
      .then(response => {
        if (!response.ok) throw new Error('Erro ao carregar funcionários');
        return response.json();
      })
      .then(data => {
        setTodosFuncionarios(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erro ao buscar funcionários:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  // Aplica filtro sempre que o filtro ou a lista geral mudam
  useEffect(() => {
    if (!todosFuncionarios.length) return;
    aplicarFiltro(todosFuncionarios, filtro);
  }, [filtro, todosFuncionarios]);

  const aplicarFiltro = (dados, filtro) => {
    const { texto, cargo } = filtro;

    const filtrado = dados.filter(func => {
      const nome = removerAcentos(func.nome_funcionario.toLowerCase());
      const cargoFunc = removerAcentos(func.cargo_funcionario?.toLowerCase() || '');
      const buscaTexto = removerAcentos(texto.toLowerCase());

      const correspondeNome = texto ? nome.includes(buscaTexto) : true;
      const correspondeCargo = cargo && cargo.toLowerCase() !== 'todos'
        ? cargoFunc === cargo.toLowerCase()
        : true;

      return correspondeNome && correspondeCargo;
    });

    const traduzirCargo = (cargo) => {
      switch (cargo) {
        case 'ADM':
          return 'Administrador';
        case 'Funcionario':
          return 'Funcionário';
        case 'Gerente':
        default:
          return cargo;
      }
    };

    const formatados = filtrado.map(func => ({
      id: func.id_funcionario,
      nome: func.nome_funcionario,
      imagem_url: func.imagem_url || 'https://via.placeholder.com/150',
      descricao: [
        { texto: `Email: ${func.email_funcionario}` },
        { texto: `Cargo: ${traduzirCargo(func.cargo_funcionario)}` }
      ],
      acoes: [
        { onClick: () => navigate(`/visualizar_funcionario/${func.id_funcionario}`) },
        { onClick: () => handleDelete(func.id_funcionario) },
      ]
    }));

    setFuncionarios(formatados);
  };

  const handleCardClick = (id) => {
    navigate(`/visualizar_funcionario/${id}`);
    console.log('Passado para a tela de visualizar')
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:3000/deletarFuncionario/${id}`, {
      method: 'DELETE'
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao deletar o funcionário');
        }
        // Atualiza a lista removendo o funcionário deletado, sem reload
        setTodosFuncionarios(prev => prev.filter(func => func.id_funcionario !== id));
        alert('Funcionário deletado com sucesso!');
      })
      .catch(error => {
        console.error(error);
        alert('Erro ao deletar funcionário: ' + error.message);
      });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-3">
        <h4>Erro ao carregar funcionários</h4>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <NavBar />

      <Container>
        <h1 style={{ marginTop: "100px" }}><b>FUNCIONÁRIOS</b></h1>

        <Pesquisa
          nomeDrop="Cargo"
          navega="/cadastro_funcionario"
          TxtButton="Funcionários +"
          lista={[
            { texto: "Gerente", value: "Gerente" },
            { texto: "ADM", value: "ADM" },
            { texto: "Funcionario", value: "Funcionario" }
          ]}
          onFilterChange={(cargoSelecionado) => setFiltro(prev => ({ ...prev, cargo: cargoSelecionado }))}
          onSearchChange={(textoDigitado) => setFiltro(prev => ({ ...prev, texto: textoDigitado }))}
        />

        <CardGeral
          card={funcionarios}
          imgHeight={250}
          onCardClick={handleCardClick}
          showButtons={false}
          customButton={(item) => (
            <>
              <Button
                variant='warning'
                className='rounded-circle fs-5 text-center shadow m-1'
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/visualizar_funcionario/${item.id}`);
                }}
              >
                <FaEdit />
              </Button>
              <Button
                variant='danger'
                className='rounded-circle fs-5 text-center shadow m-1'
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm('Deseja deletar o funcionário?')) {
                    handleDelete(item.id);
                  }
                }}
              >
                <FaRegTrashAlt />
              </Button>
            </>
          )}
        />
      </Container>
    </div>
  );
};

export default Funcionarios;