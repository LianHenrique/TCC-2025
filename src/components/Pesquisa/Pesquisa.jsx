import { Button, Dropdown, FloatingLabel, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";

const Pesquisa = ({ lista, nomeDrop, navega, onFilterChange }) => {
  const { register, handleSubmit } = useForm();
  const [filtroSelecionado, setFiltroSelecionado] = useState("");

  const onSubmit = (data) => {
    onFilterChange({
      texto: data.pesquisa || "",
      filtro: filtroSelecionado
    });
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} 
    style={{ marginTop: "100x" }}>
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
        <Dropdown
          className="d-flex shadow rounded-5"
        >
          <Dropdown.Toggle
            variant="outline-primary rounded-5"
          >
            {filtroSelecionado || nomeDrop}
          </Dropdown.Toggle>
          <Dropdown.Menu className="rounded-3">
            {lista.map((item, index) => (
              <Dropdown.Item
                key={index}
                onClick={() => {
                  setFiltroSelecionado(item.texto);
                }}
              >
                {item.texto}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <Button
          type="submit"
          className="shadow rounded-5"
          style={{ 
            padding: "15px",
            width: "70px"
          }}
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