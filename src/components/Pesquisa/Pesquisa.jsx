import { Button, Dropdown, FloatingLabel, Form } from "react-bootstrap"
import { useForm } from "react-hook-form";

const Pesquisa = (lista, nomeDrop) => {

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
                        className="rounded-3"
                    />
                    <Dropdown
                        className="d-flex"
                    >
                        <Dropdown.Toggle variant="outline-primary">
                            {nomeDrop}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {
                                lista.map((item, index) => (
                                    <Dropdown.Item 
                                    key={index}
                                    href={item.link}>
                                        {item.lista}
                                    </Dropdown.Item>
                            ))
                            }
                        </Dropdown.Menu>
                    </Dropdown>
                    <Button>
                        Cadastrar
                    </Button>
                </FloatingLabel>
            </form>
        </div>
    )
}

export default Pesquisa