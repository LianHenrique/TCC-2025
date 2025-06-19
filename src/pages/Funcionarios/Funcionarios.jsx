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
  const [filtro, setFiltro] = useState({ texto: '', filtro: '' });
  const navigate = useNavigate();

  const removerAcentos = (texto) => {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  useEffect(() => {
    fetch('http://localhost:3000/funcionarios')
      .then(response => response.json())
      .then(data => setTodosFuncionarios(data))
      .catch(error => console.error('Erro ao buscar funcionários:', error));
  }, []);

  useEffect(() => {
    if (!todosFuncionarios.length) return;  // evita filtro antes de dados carregarem
    aplicarFiltro(todosFuncionarios, filtro);
  }, [filtro, todosFuncionarios]);

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
        console.log('Funcionário deletado com sucesso');
        window.location.reload();
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
            { texto: "Gerente", value: "Gerente" },
            { texto: "ADM", value: "ADM" },
            { texto: "Funcionario", value: "Funcionario" }
          ]}
          onFilterChange={(filtroSelecionado) =>
            setFiltro({ ...filtro, filtro: filtroSelecionado })
          }
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