import { Button, Dropdown } from "react-bootstrap"

const Filtro = (nome, lista) => {
    return (
        <div 
        className="d-flex">
            <Dropdown 
            className="d-flex shadow rounded-5">
                <Dropdown.Toggle 
                variant="outline-primary rounded-5">
                    {nome}
                </Dropdown.Toggle>
                <Dropdown.Menu>
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
            <Button
                className="rounded-5 m-2 mt-3 fs-2"
                style={{
                    width: "60px"
                }}>
                +
            </Button>
        </div>
    )
}

export default Filtro