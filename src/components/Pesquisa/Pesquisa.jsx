import { Button, Dropdown, FloatingLabel, Form } from "react-bootstrap"
import { useForm } from "react-hook-form";

const Pesquisa = ({ lista, nomeDrop }) => {

    const [funcionarios, setFuncionarios] = useState([])

    const fetchFuncionarios = async () => {
        try {

            // Aqui eu tive que definir os ids, pq agente não sabe como exatamente que o funcionário vai estar presente no relatório.
            const IDfuncionario = [1, 2, 3, 4];
            const NomeFuncionario = [func.nome_funcionairo];

            const nomeResponsePromises = NomeFuncionario.map(nome =>
                fetch(`http://localhost:3000/funcionarios/${nome}`)
                    .then((response) => response.json())
                    .catch((error) => {
                        console.error('Erro ao buscar funcionário:', error);
                    })
            );

            const idResponsePromises = IDfuncionario.map(id =>
                fetch(`http://localhost:3000/funcionarios/${id}`)
                    .then((response) => response.json())
                    .catch((error) => {
                        console.error('Erro ao buscar funcionário:', error);
                    })
            );

            // Vai esperar tudo ser puxado para rodar
            const funcionariosData = await Promise.all(responsePromises)

            // formatando os dados. (opcional)
            const funcionariosFormatados = funcionariosData.map(func => ({
                nome: func.nome_funcionairo, //sim, o pedro digitou errado no banco
                link: func.imagem_url || 'https://img.freepik.com/fotos-premium/hamburguer-bonito-em-fundo-escuro_213607-15.jpg',
                descricao: [
                    { texto: `Cargo: ${func.cargo_funcionario}` },
                    { texto: `Email: : ${func.email_funcionario}` },
                ]
            }))

            setFuncionarios(funcionariosFormatados);
        } catch (error) {
            console.error('Erro ao buscar dados dos funcionários:', error)
        }
    }

    useEffect(() => {
        if (funcionarios.length === 0) {
            fetchFuncionarios();
        }
    }, []);

    const {
        formState: { errors },
    } = useForm();

    return (
        <div style={{
            marginTop: "100px"
        }}>
            <form>
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
                        <Dropdown.Menu className="rounded-5">
                            {lista.map((item, index) => (
                                <Dropdown.Item
                                    key={index}
                                    to={item.link}
                                    className="dropdown-item"
                                >
                                    {item.texto}
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