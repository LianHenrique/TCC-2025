import { useState } from "react";
import { Button, FloatingLabel } from "react-bootstrap"
import Form from 'react-bootstrap/Form';

const EditarQuantidade = (props) => {

    const [quantidade, setQuantidade] = useState(props.quantidade)

  return (
    <div
    className="d-flex gap-2">
        <Button
        className="rounded-5 fs-3"
        style={{
            width:"58px"
        }}
        variant="danger"
        onClick={() => {
            if(quantidade > 0){
                setQuantidade(quantidade - 1)
            }
        }}>
            -
        </Button>
        <FloatingLabel 
        controlId="Quantidade" 
        label="Quantidade">
            <Form.Control
              type="number"
              placeholder="Quantidade"
              value={quantidade}
              className="rounded-5 shadow"
              style={{
                border: 'none'
            }}
            />
          </FloatingLabel>
        <Button
        className="rounded-5"
        style={{
            width:"58px"
        }}
        variant="success"
        onClick={() => {
            setQuantidade(quantidade + 1)
        }}>
            +
        </Button>
    </div>
  )
}

export default EditarQuantidade