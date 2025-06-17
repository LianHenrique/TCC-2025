import { Container } from 'react-bootstrap';
import NavBar from '../../components/NavBar/NavBar';
import Pesquisa from '../../components/Pesquisa/Pesquisa';
import CardGeral from '../../components/Cards/CardGeral';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { FaEdit, FaRegTrashAlt } from 'react-icons/fa';

const Funcionarios = () => {
  const [todosFuncionarios, setTodosFuncionarios] = useState([]);  // Lista completa
  const [funcionarios, setFuncionarios] = useState([]);          // Lista filtrada
  const [filtro, setFiltro] = useState({ texto: '', filtro: '' }); // Estado filtro

  const navigate = useNavigate();

  // Remove acentos de texto
  const removerAcentos = (texto) => {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  // Carrega os funcionários ao iniciar
  useEffect(() => {
    fetch('http://localhost:3000/funcionarios')
      .then(response => response.json())
      .then(data => setTodosFuncionarios(data))
      .catch(error => console.error('Erro ao buscar funcionários:', error));
  }, []);

  // Aplica filtro quando filtro ou lista completa mudam
  useEffect(() => {
    if (!todosFuncionarios.length) return;  // evita filtro antes de dados carregarem
    aplicarFiltro(todosFuncionarios, filtro);
  }, [filtro, todosFuncionarios]);

  // Aplica filtro de nome e cargo
  const aplicarFiltro = (dados, filtro) => {
    const { texto, filtro: cargoFiltro } = filtro;

    const filtrado = dados.filter(func => {
      const nome = removerAcentos(func.nome_funcionario.toLowerCase());
      const cargo = removerAcentos(func.cargo_funcionario?.toLowerCase() || '');
      const busca = removerAcentos(texto.toLowerCase());

      const correspondeNome = texto ? nome.includes(busca) : true;
      const correspondeCargo = cargoFiltro ? cargo === cargoFiltro.toLowerCase() : true;

      return correspondeNome && correspondeCargo;
    });

    const formatados = filtrado.map(func => ({
      id: func.id_funcionario,
      nome: func.nome_funcionario,
      link: func.imagem_url || 'https://via.placeholder.com/150',
      descricao: [
        { texto: `Email: ${func.email_funcionario}` },
        { texto: `Cargo: ${func.cargo_funcionario}` }
      ],
    }));

    setFuncionarios(formatados);
  };

  // Navega ao clicar no card
  const handleCardClick = (id) => {
    navigate(`/visualizar_funcionario/${id}`);
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:3000/deletarFuncionario/${id}`, {
      method: 'DELETE'
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao deletar o funcionário');
        }
        console.log('Funcionário deletado com sucesso');
        // Atualiza a lista local para evitar reload da página
        setTodosFuncionarios(prev => prev.filter(f => f.id_funcionario !== id));
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <div>
      <NavBar />

      <Container>
        <h1 style={{ marginTop: "100px" }}>Funcionários</h1>

        <Pesquisa
          nomeDrop="Cargo"
          navega="/cadastro_funcionario"
          lista={[
            { texto: "Gerente", link: "#gerente" },
            { texto: "Estoquista", link: "#estoquista" }
          ]}
          filtro={filtro}
          setFiltro={setFiltro}  // IMPORTANTE: passar o setter para Pesquisa atualizar filtro
        />

        <CardGeral
          card={funcionarios}
          imgHeight={250}
          onCardClick={handleCardClick}
          showButtons={false}
          customButton={item => (
            <>
              <Button
                variant='warning'
                className='rounded-circle fs-5 text-center shadow m-1'
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/editar_funcionario/${item.id}`);
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