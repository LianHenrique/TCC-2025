import { Button, Container, FloatingLabel, Form } from "react-bootstrap"
import NavBar from "../../components/NavBar/NavBar"

const RecSenha = () => {
    return (
        <div>
            <NavBar />
            <Container>
                <Form
                    className='shadow'
                    style={{
                        padding: "30px",
                        margin: "100px",
                        borderRadius: "20px",
                        border: "1px blue solid"
                    }}>
                    <h1>Recuperação de senha</h1>

                    <FloatingLabel
                        controlId="floatingInput"
                        label="Palavra chave"
                        className="m-2">
                        <Form.Control
                            type="text"
                            placeholder="Palavra chave"
                            className="rounded-5 shadow mt-3"
                            style={{
                                border: "none"
                            }}
                        />
                    </FloatingLabel>

                    <div className="d-flex justify-content-end mt-4">
                        <Button>Enviar</Button>
                    </div>
                </Form>
            </Container>
        </div>
    )
}

export default RecSenha