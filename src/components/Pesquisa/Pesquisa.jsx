import { useForm } from "react-hook-form";
import { useState } from "react";
import {
  Button,
  Dropdown,
  InputGroup,
  Form
} from "react-bootstrap";
import { FaSearch } from "react-icons/fa";

const Pesquisa = ({ lista, nomeDrop, navega, onFilterChange }) => {
  const { register, handleSubmit, reset, watch } = useForm();
  const [filtroSelecionado, setFiltroSelecionado] = useState("Todos");

  const textoBusca = watch("pesquisa"); // para capturar dinamicamente

  const handleDropdownSelect = (value) => {
    setFiltroSelecionado(value);
    reset({ pesquisa: "" }); // limpa o campo de texto
    onFilterChange(value, ""); // atualiza o filtro com texto vazio
  };

  const onSubmit = (data) => {
    const texto = data.pesquisa.trim();
    onFilterChange(filtroSelecionado, texto);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="m-2">
      <InputGroup className="mb-3 shadow-sm">
        <Form.Control
          type="text"
          placeholder="Buscar..."
          {...register("pesquisa")}
        />

        <Dropdown>
          <Dropdown.Toggle
            variant="outline-primary"
            className="rounded-0"
            id="dropdown-filtro"
          >
            {filtroSelecionado === nomeDrop ? "Todos" : filtroSelecionado}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleDropdownSelect("Todos")}>
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
          variant="outline-secondary"
          className="rounded-end"
          title="Buscar"
        >
          <FaSearch />
        </Button>
      </InputGroup>

      <div className="d-flex justify-content-start">
        <Button
          href={navega}
          className="shadow rounded-3"
          variant="primary"
          style={{ padding: "10px 20px" }}
        >
          Cadastrar
        </Button>
      </div>
    </Form>
  );
};

export default Pesquisa;