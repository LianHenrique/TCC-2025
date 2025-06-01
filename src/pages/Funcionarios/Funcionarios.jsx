import { Container } from 'react-bootstrap';
import NavBar from '../../components/NavBar/NavBar';
import Pesquisa from '../../components/Pesquisa/Pesquisa';
import CardGeral from '../../components/Cards/CardGeral';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';

const Funcionarios = () => {
  const [funcionarios, setFuncionarios] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3000/funcionarios')
      .then(response => response.json())
      .then(data => {
        const funcionariosFormatados = data.map(func => ({
          id: func.id_funcionario,
          nome: func.nome_funcionario,
          link: func.link || 'https://via.placeholder.com/150',
          descricao: [
            { texto: `Email: ${func.email_funcionario}` },
            { texto: `Cargo: ${func.cargo_funcionario}` }
          ]
        }));
        setFuncionarios(funcionariosFormatados);
      })
      .catch(error => console.error('Erro ao buscar funcionários:', error));
  }, []);

  function handleCardClick(id) {
    navigate(`/visualizar_funcionario/${id}`);
  }

  return (
    <div>
      <NavBar />

      <Container>
        <Pesquisa
          nomeDrop="Cargo"
          lista={[
            { lista: "Gerente", link: "#gerente" },
            { lista: "Estoquista", link: "#estoquista" }
          ]}
        />

        <CardGeral
          filtro=""
          card={funcionarios}
          onCardClick={handleCardClick}
        />
      </Container>
    </div>
  );
};

export default Funcionarios;