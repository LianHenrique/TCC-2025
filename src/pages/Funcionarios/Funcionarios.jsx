import { Container } from 'react-bootstrap';
import NavBar from '../../components/NavBar/NavBar';
import Pesquisa from '../../components/Pesquisa/Pesquisa';
import CardGeral from '../../components/Cards/CardGeral';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';

const Funcionarios = () => {
  const [funcionarios, setFuncionarios] = useState([]);
  const [todosFuncionarios, setTodosFuncionarios] = useState([]);
  const [filtro, setFiltro] = useState({ texto: '', filtro: '' });
  const navigate = useNavigate();

  // Função para remover acentos e normalizar o texto
  const removerAcentos = (texto) => {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  // Carrega os funcionários ao iniciar
  useEffect(() => {
    fetch('http://localhost:3000/funcionarios')
      .then(response => response.json())
      .then(data => {
        setTodosFuncionarios(data);
        aplicarFiltro(data, filtro);
      })
      .catch(error => console.error('Erro ao buscar funcionários:', error));
  }, []);

  // Aplica filtro sempre que o estado de filtro mudar
  useEffect(() => {
    aplicarFiltro(todosFuncionarios, filtro);
  }, [filtro]);

  // Função para aplicar o filtro baseado em texto e cargo
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

  // Quando clicar no card, redireciona para visualização
  const handleCardClick = (id) => {
    navigate(`/visualizar_funcionario/${id}`);
  };

  return (
    <div>
      <NavBar />
      <Container>
        <h1 style={{ marginTop: "100px" }}>Funcionário</h1>
        <Pesquisa
          nomeDrop="Cargo"
          navega="/cadastro_funcionario"
          lista={[
            { texto: "Gerente", link: "#gerente" },
            { texto: "Estoquista", link: "#estoquista" }
          ]}
          onFilterChange={setFiltro}
        />
        <CardGeral
          filtro=""
          card={funcionarios}
          imgHeight={250}
          onCardClick={handleCardClick}
          showButtons={true}
        />
      </Container>
    </div>
  );
};

export default Funcionarios;