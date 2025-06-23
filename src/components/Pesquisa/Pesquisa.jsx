import { Button, Dropdown, FloatingLabel, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";

const Pesquisa = ({ lista, nomeDrop, navega, onFilterChange }) => {
  const { register, handleSubmit } = useForm();
  const [filtroSelecionado, setFiltroSelecionado] = useState(nomeDrop);

  const handleDropdownSelect = (value) => {
    setFiltroSelecionado(value);
    // Chama imediatamente o filtro quando seleciona uma categoria
    onFilterChange(value === nomeDrop ? 'Todos' : value);
  };

  const onSubmit = (data) => {
    // Implementação da pesquisa por texto (se necessário)
    console.log("Texto pesquisado:", data.pesquisa);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FloatingLabel
        controlId="floatingInput"
        label="Pesquisa"
        className="m-2 d-flex gap-3"
      >
        <Form.Control
          type="text"
          placeholder="Pesquisa"
          className="rounded-3 shadow"
          {...register("pesquisa")}
          style={{ 
            border: "none",
            width: "500px"
          }}
        />
        <Dropdown>
          <Dropdown.Toggle variant="outline-primary rounded-3"
          style={{
            minHeight: "58px"
          }}>
            {filtroSelecionado}
          </Dropdown.Toggle>
          <Dropdown.Menu className="rounded-3">
            <Dropdown.Item 
            onClick={() => handleDropdownSelect(nomeDrop)}>
              Todos
            </Dropdown.Item>
            {lista.map((item, index) => (
              <Dropdown.Item
                key={index}
                onClick={() => handleDropdownSelect(item.value)}
              >
                {item.texto}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </FloatingLabel>

      <div className="d-flex gap-3 m-2">
        <Button
          href={navega}
          className="shadow rounded-3"
          style={{ padding: "15px" }}
        >
          Cadastrar
        </Button>
      </div>
    </Form>
  );
};

export default Pesquisa;