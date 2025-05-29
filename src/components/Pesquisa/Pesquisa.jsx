import { Button, Dropdown, FloatingLabel, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";

const Pesquisa = ({ lista, nomeDrop, navega }) => {
  const { register } = useForm();

  return (
    <div style={{
      marginTop: "150px"
    }}>
      <FloatingLabel controlId="floatingInput" label="Pesquisa" className="m-2 d-flex gap-3">
        <Form.Control
          type="text"
          placeholder="Pesquisa"
          className="rounded-5 shadow"
          {...register("pesquisa")}
          style={{ border: "none" }}
        />
        <Dropdown
          className="d-flex shadow rounded-5"
          style={{
            width: "160px"
          }}>
          <Dropdown.Toggle
            variant="outline-primary rounded-5"
            style={{
              width: "160px"
            }}>
            {nomeDrop}
          </Dropdown.Toggle>
          <Dropdown.Menu className="rounded-3">
            {lista.map((item, index) => (
              <Dropdown.Item key={index} to={item.link} className="dropdown-item">
                {item.texto}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </FloatingLabel>
      <Button
        href={navega}
        style={{
          padding: "15px"
        }}
        className="shadow rounded-5 m-2">
        Cadastrar
      </Button>
    </div>
  );
};

export default Pesquisa;