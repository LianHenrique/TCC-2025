import { Container } from 'react-bootstrap';
import NavBar from '../../components/NavBar/NavBar';
import Pesquisa from '../../components/Pesquisa/Pesquisa';
import CardGeral from '../../components/Cards/CardGeral';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { FaEdit, FaRegTrashAlt } from 'react-icons/fa';

const Funcionarios = () => {
  const [funcionarios, setFuncionarios] = useState([]);
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

  // Aplica filtro quando filtro mudar
  useEffect(() => {
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
  }


  const handleDelete = (id) => {
    fetch(`http://localhost:3000/deletarFuncionario/${id}`, {
      method: 'DELETE'
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao deletar o funcionário')
        }
        console.log('Funcionário deletado com sucesso')
        window.location.reload();
      })
      .catch(error => {
        console.error(error)
      })
  }


  return (
    <div>
      <NavBar />

      <Container>
        <h1 style={{ marginTop: "100px" }}>Funcionários</h1>

        <Pesquisa
          nomeDrop="Cargo"
          navega="/cadastro_funcionario"
          lista={[
            {
              lista: "Gerente",
              link: "#gerente"
            },
            {
              lista: "Estoquista",
              link: "#estoquista"
            }
          ]}
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
                  if (item.acoes && item.acoes[0]?.onClick) item.acoes[0].onClick();
                }}
              >
                <FaEdit />
              </Button>
              <Button
                variant='danger'
                className='rounded-circle fs-5 text-center shadow m-1'
                onClick={(e) => {
                  e.stopPropagation();
                  {
                    const confirmar = window.confirm('Deseja deletar o funcionário?')
                    if (confirmar) {
                      handleDelete(item.id);
                    }
                  } 
                  if (item.acoes && item.acoes[1]?.onClick) item.acoes[1].onClick();
                }}
              >
                <FaRegTrashAlt />
              </Button>
            </>
          )
          }
        />
      </Container>
    </div>
  );
};

export default Funcionarios;
