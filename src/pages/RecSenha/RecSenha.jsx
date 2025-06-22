import { useState } from "react";
import { Button, Container, FloatingLabel, Form, Modal } from "react-bootstrap";
import NavBar from "../../components/NavBar/NavBar";

const RecSenha = () => {
  const [email, setEmail] = useState("");
  const [palavraChave, setPalavraChave] = useState("");
  const [novaPalavraChave, setNovaPalavraChave] = useState("");

  const [senhaRecuperada, setSenhaRecuperada] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [etapa, setEtapa] = useState("email"); // email | palavraChave | verSenha | alterar
  const [showModal, setShowModal] = useState(false);

  const verificarEmail = async (e) => {
    e.preventDefault();

    if (!email) {
      setMensagem("Digite o e-mail.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/checar-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setEtapa("palavraChave");
        setMensagem("Email confirmado. Agora digite sua palavra-chave.");
      } else {
        setMensagem(data.error || "Email não encontrado.");
      }
    } catch (err) {
      console.error(err);
      setMensagem("Erro ao conectar com o servidor.");
    }
  };

  const verificarPalavraChave = async (e) => {
    e.preventDefault();

    if (!palavraChave) {
      setMensagem("Digite a palavra-chave.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/recuperar-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, palavraChave }),
      });

      const data = await response.json();

      if (response.ok && data.senha) {
        setSenhaRecuperada(data.senha);
        setEtapa("verSenha"); // mostra a senha antes de abrir modal
        setMensagem("");
      } else {
        setMensagem(data.error || "Palavra-chave incorreta.");
      }
    } catch (err) {
      console.error(err);
      setMensagem("Erro ao conectar com o servidor.");
    }
  };

  const handleAlterarPalavraChave = async () => {
    if (!novaPalavraChave) {
      alert("Digite a nova palavra-chave.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/alterar-palavra-chave", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, novaPalavraChave }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Palavra-chave atualizada com sucesso!");
        window.location.href = "/login";
      } else {
        alert(data.error || "Erro ao alterar palavra-chave.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao conectar com o servidor.");
    }
  };

  return (
    <div>
      <NavBar />
      <Container>
        {etapa !== "verSenha" && (
          <Form
            onSubmit={etapa === "email" ? verificarEmail : verificarPalavraChave}
            className="shadow"
            style={{
              padding: "30px",
              margin: "100px auto",
              borderRadius: "20px",
              border: "1px blue solid",
              maxWidth: "500px",
            }}
          >
            <h1>Recuperação de Senha</h1>

            {etapa === "email" && (
              <FloatingLabel controlId="email" label="Email" className="m-2">
                <Form.Control
                  type="email"
                  placeholder="Digite seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-5 shadow mt-3"
                  style={{ border: "none" }}
                />
              </FloatingLabel>
            )}

            {etapa === "palavraChave" && (
              <FloatingLabel controlId="palavra" label="Palavra-chave" className="m-2">
                <Form.Control
                  type="text"
                  placeholder="Digite sua palavra-chave"
                  value={palavraChave}
                  onChange={(e) => setPalavraChave(e.target.value)}
                  className="rounded-5 shadow mt-3"
                  style={{ border: "none" }}
                />
              </FloatingLabel>
            )}

            <div className="d-flex justify-content-end mt-4">
              <Button type="submit">
                {etapa === "email" ? "Verificar email" : "Confirmar palavra-chave"}
              </Button>
            </div>

            {mensagem && (
              <p className="mt-3 text-center">
                <strong>{mensagem}</strong>
              </p>
            )}

            <div className="text-center mt-3">
              <Button variant="outline-primary" href="/login">
                Voltar ao login
              </Button>
            </div>
          </Form>
        )}

        {etapa === "verSenha" && (
          <div
            className="shadow"
            style={{
              padding: "30px",
              margin: "100px auto",
              borderRadius: "20px",
              border: "1px blue solid",
              maxWidth: "500px",
              textAlign: "center",
            }}
          >
            <h2>Sua senha é:</h2>
            <p className="fw-bold fs-4">{senhaRecuperada}</p>
            <Button variant="primary" onClick={() => setShowModal(true)}>
              OK, alterar palavra-chave
            </Button>
          </div>
        )}
      </Container>

      {/* Modal obrigatório após visualização da senha */}
      <Modal show={showModal} onHide={() => {}} backdrop="static" keyboard={false} centered>
        <Modal.Header>
          <Modal.Title>Alterar palavra-chave</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nova palavra-chave</Form.Label>
            <Form.Control
              type="text"
              placeholder="Digite a nova palavra-chave"
              value={novaPalavraChave}
              onChange={(e) => setNovaPalavraChave(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleAlterarPalavraChave}>
            Atualizar e continuar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RecSenha;
