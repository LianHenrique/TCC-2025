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
          id: func.id_funcionairo,
          nome: func.nome_funcionairo,
          link: func.link || 'https://cdn.melhoreshospedagem.com/wp/wp-content/uploads/2023/07/erro-404.jpg',
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
          onCardClick={handleCardClick}
        />
      </Container>
    </div>
  );
};

export default Funcionarios;