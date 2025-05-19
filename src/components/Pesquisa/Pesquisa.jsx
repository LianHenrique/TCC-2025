import { Button, Card, Dropdown, FloatingLabel, Form } from "react-bootstrap"
import { useForm } from "react-hook-form";

import { FaRegTrashAlt } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";

const Pesquisa = (props) => {

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
                            Filtro
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item href="#/action-1">Bebidas</Dropdown.Item>
                            <Dropdown.Item href="#/action-2">Carnes</Dropdown.Item>
                            <Dropdown.Item href="#/action-3">Saladas</Dropdown.Item>
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