import { Button, Dropdown, FloatingLabel, Form } from "react-bootstrap"
import { useForm } from "react-hook-form";

const Pesquisa = ({lista, nomeDrop}) => {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = () => {

    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <FloatingLabel controlId="floatingInput" label="Pesquisa" className="m-2 d-flex gap-3">
                    <Form.Control
                        type="text"
                        placeholder="Pesquisa"
                        className="rounded-5 shadow"
                        style={{
                            border: "none"
                        }}
                    />
                    <Dropdown className="d-flex shadow rounded-5">
                        <Dropdown.Toggle variant="outline-primary rounded-5">
                            {nomeDrop}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {lista.map((item, index) => (
                            <Dropdown.Item
                                key={index}
                                to={item.link}
                                className="dropdown-item"
                            >
                                {item.lista}
                            </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Button className="shadow rounded-5">
                        Cadastrar
                    </Button>
                </FloatingLabel>
            </form>
        </div>
    )
}

export default Pesquisa