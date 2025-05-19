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
            <Card style={{ width: '18rem', margin: "10px"}}>
                <Card.Img variant="top" src="https://organic4.com.br/wp-content/uploads/2023/04/img-site-1-lanches-burger-carne.jpg" />
                <Card.Body>
                    <Card.Title>Hamburguer</Card.Title>
                    <Card.Text>
                        Carne de lanche comum
                    </Card.Text>
                    <Card.Text>
                        Data de entrada: XX/XX/XXXX
                    </Card.Text>
                    <Card.Text>
                        Quantidade: XX
                    </Card.Text>
                    <Card.Text>
                        R$ XX
                    </Card.Text>
                    <Button 
                    variant="warning" 
                    className="rounded-circle fs-5 text-center shadow m-1">
                        <FaEdit />
                    </Button>
                    <Button 
                    variant="danger" 
                    className="rounded-circle fs-5 text-center shadow">
                        <FaRegTrashAlt />
                    </Button>
                </Card.Body>
            </Card>
        </div>
    )
}

export default Pesquisa