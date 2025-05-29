import { useEffect, useState } from "react";
import { Button, Dropdown, FloatingLabel, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";

const Pesquisa = ({ lista, nomeDrop, onResultado }) => {
  const { register, handleSubmit } = useForm();
  const [pesquisa, setPesquisa] = useState("");

  const fetchFuncionarios = async () => {
    try {
      const NomeFuncionario = [pesquisa];
      const nomeResponsePromises = NomeFuncionario.map(nome =>
        fetch(`http://localhost:3000/funcionarios/${nome}`)
          .then(response => response.json())
          .catch(error => {
            console.error("Erro ao buscar funcionário:", error);
          })
      );

      const funcionariosPesquisa = await Promise.all(nomeResponsePromises);

      const funcionariosFormatados = funcionariosPesquisa.map(func => ({
        nome: func.nome_funcionario,
        link: func.imagem_url || "https://img.freepik.com/fotos-premium/hamburguer-bonito-em-fundo-escuro_213607-15.jpg",
        descricao: [
          { texto: `Cargo: ${func.cargo_funcionario}` },
          { texto: `Email: ${func.email_funcionario}` },
        ]
      }));

      onResultado(funcionariosFormatados);
    } catch (error) {
      console.error("Erro ao buscar dados dos funcionários:", error);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (pesquisa.trim().length > 0) {
        fetchFuncionarios();
      } else {
        onResultado([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [pesquisa]);

  const onSubmit = data => {
    setPesquisa(data.pesquisa);
  };

  return (
    <div style={{ 
      marginTop: "150px",
      position: "absolute"
      }}>
      <FloatingLabel controlId="floatingInput" label="Pesquisa" className="m-2 d-flex gap-3">
        <Form.Control
          type="text"
          placeholder="Pesquisa"
          className="rounded-5 shadow"
          {...register("pesquisa")}
          style={{ border: "none" }}
        />
        <Dropdown className="d-flex shadow rounded-5">
          <Dropdown.Toggle variant="outline-primary rounded-5">
            {nomeDrop}
          </Dropdown.Toggle>
          <Dropdown.Menu className="rounded-5">
            {lista.map((item, index) => (
              <Dropdown.Item key={index} to={item.link} className="dropdown-item">
                {item.texto}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </FloatingLabel>
    </div>
  );
};

export default Pesquisa;