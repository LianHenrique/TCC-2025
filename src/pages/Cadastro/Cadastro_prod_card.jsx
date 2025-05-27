import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import NavBar from '../../components/NavBar/NavBar';
import '../Style/login.css'; // Importa o CSS

const Cadastroprodcard = () => {
    const [senha, setSenha] = useState(""); // alterado para numero de ingredientes
    const [nome, setNomeprod] = useState(""); // mantem e muda para nomeProd

    const Cadastrosprod = () => {
        const users = JSON.parse(localStorage.getItem("users")) || [];

        // const usuarioExistente = users.find((user) => user.email === email);

        if (senha === "" || nome === "") {
            alert("Os campos não podem ser vazios")
            setNomeprod("");
            setSenha("");
            return;
        } // mantem mudando as validações
        if (senha.length >= 0) {
            alert("A Quantidade/preço deve ter no mínimo 1 numero")
            setNomeprod("");
            setSenha("");
            return;
        }

        const novoUsuario = {
            nome: nome,
            senha: senha,
        };

        users.push(novoUsuario);

        localStorage.setItem("users", JSON.stringify(users));

        alert("Cadastro realizado com sucesso!");
        setNomeprod("");
        setSenha("");
    }

    return (
        <div className="login-bg">
            <div className="login-box">
                <h2>Cadastro</h2>

                <NavBar />
                <Form>
                    <Form.Group className="mb-3" controlId="formGroupEmail">
                        <Form.Label>NomeProd</Form.Label>
                        <Form.Control type="text" placeholder='Nome do produto' value={nome} onChange={(e) => setEmail(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formGroupPassword">
                        <Form.Label>QtdProd</Form.Label>
                        <Form.Control type="text" placeholder='Quantidade do produto' value={senha} onChange={(e) => setSenha(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formGroupPassword">
                        <Form.Label>Descrica</Form.Label>
                        <Form.Control type="text" placeholder='Descreva o produto(opcional)' value={nome} onChange={(e) => setSenha(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formGroupPassword">
                        <Form.Label>ValorProd</Form.Label>
                        <Form.Control type="text" placeholder='Valor produto' value={senha} onChange={(e) => setSenha(e.target.value)} />
                    </Form.Group>
                </Form>
                <button variant="primary" style={{ width: '100%', backgroundColor: '#3840BA', color: '#fff' }} onClick={Cadastrosprod} onClickCapture={() => navigate('/')}>Entrar</button>
            </div>
        </div>

    )
}

export default Cadastroprodcard