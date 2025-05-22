import { Container } from 'react-bootstrap'
import NavBar from '../../components/NavBar/NavBar'
import Pesquisa from '../../components/Pesquisa/Pesquisa'
import CardGeral from '../../components/Cards/CardGeral'
import { useEffect, useState } from 'react'

const Funcionarios = () => {
  const [funcionarios, setFuncionarios] = useState([]);

  const handleResultadoPesquisa = (resultados) => {
    setFuncionarios(resultados);
  };

  const fetchFuncionarios = async () => {
    try {
      const IDfuncionario = [1, 2, 3, 4];

      const responsePromises = IDfuncionario.map(id =>
        fetch(`http://localhost:3000/funcionarios/${id}`)
          .then((response) => response.json())
          .catch((error) => {
            console.error('Erro ao buscar funcionário:', error);
          })
      );

      const funcionariosData = await Promise.all(responsePromises);

      const funcionariosFormatados = funcionariosData.map(func => ({
        nome: func.nome_funcionairo,
        link: func.imagem_url || 'https://img.freepik.com/fotos-premium/hamburguer-bonito-em-fundo-escuro_213607-15.jpg',
        descricao: [
          { texto: `Cargo: ${func.cargo_funcionario}` },
          { texto: `Email: : ${func.email_funcionario}` },
        ]
      }));

      setFuncionarios(funcionariosFormatados);
    } catch (error) {
      console.error('Erro ao buscar dados dos funcionários:', error);
    }
  };

  useEffect(() => {
    if (funcionarios.length === 0) {
      fetchFuncionarios();
    }
  }, []);

  return (
    <div>
      <NavBar />
      <Container>
        <Pesquisa
          nomeDrop="Cargo"
          lista={[
            { texto: "ADM", link: "#ADM" },
            { texto: "Gerente", link: "#gerente" },
            { texto: "Funcionario", link: "#funcionario" }
          ]}
          onResultado={handleResultadoPesquisa}
        />
        <CardGeral
          filtro="Funcionarios"
          card={funcionarios}
        />
      </Container>
    </div>
  );
};

export default Funcionarios