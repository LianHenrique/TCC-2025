import { Dropdown } from "react-bootstrap"

const Filtro = (nome, lista) => {
    return (
        <div>
            <Dropdown className="d-flex shadow rounded-5">
                <Dropdown.Toggle variant="outline-primary rounded-5">
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
        </div>
    )
}

export default Filtro