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
    <Form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: "100px" }}>
      <FloatingLabel
        controlId="floatingInput"
        label="Pesquisa"
        className="m-2 d-flex gap-3"
      >
        <Form.Control
          type="text"
          placeholder="Pesquisa"
          className="rounded-5 shadow"
          {...register("pesquisa")}
          style={{ border: "none" }}
        />
        <Dropdown>
          <Dropdown.Toggle variant="outline-primary rounded-5">
            {filtroSelecionado}
          </Dropdown.Toggle>
          <Dropdown.Menu className="rounded-3">
            <Dropdown.Item onClick={() => handleDropdownSelect(nomeDrop)}>
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
        <Button
          type="submit"
          className="shadow rounded-5"
          style={{ padding: "15px", width: "70px" }}
        >
          <FaSearch />
        </Button>
      </FloatingLabel>

      <div className="d-flex gap-3 m-2">
        <Button
          href={navega}
          className="shadow rounded-5"
          style={{ padding: "15px" }}
        >
          Cadastrar
        </Button>
      </div>
    </Form>
  );
};

export default Pesquisa;