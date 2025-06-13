const RecSenha = () => {
  return (
    <div>
        <FloatingLabel
            controlId="floatingInput"
            label="Senha"
            className="m-2">
            <Form.Control
              type="text"
              placeholder="Senha"
              className="rounded-5 shadow mt-3"
              style={{
                border: "none"
              }}
            />
          </FloatingLabel>
    </div>
  )
}

export default RecSenha