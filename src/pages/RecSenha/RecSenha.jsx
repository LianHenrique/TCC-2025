import { Container, FloatingLabel, Form } from "react-bootstrap"
import NavBar from "../../components/NavBar/NavBar"

const RecSenha = () => {
    return (
        <div>
            <NavBar />
            <Form
                className='shadow'
                style={{
                    padding: "30px",
                    margin: "100px",
                    borderRadius: "20px",
                    border: "1px blue solid"
                }}>
                <Container>
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
                </Container>
            </Form>
        </div>
    )
}

export default RecSenha