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

  useEffect(() => {
    fetch('http://localhost:3000/funcionarios')
      .then(response => response.json())
      .then(data => {
        const FuncionariosFormatados = data.map(func => ({
          id: func.id_funcionario,
          nome: func.nome_funcionario,
          link: func.imagem_url || 'https://via.placeholder.com/150',
          descricao: [
            { texto: `Email: ${func.email_funcionario}` },
            { texto: `Cargo: ${func.cargo_funcionario}` }
          ],
        }))
        setFuncionarios(FuncionariosFormatados)
      })
      .catch(error => console.error('Erro ao buscar funcionários:', error));
  }, []);

  function handleCardClick(id) {
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
        <h1
          style={{
            marginTop: "100px"
          }}>Funcionario</h1>
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
          filtro=""
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
