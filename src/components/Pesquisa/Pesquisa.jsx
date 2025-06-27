import { useState } from 'react';
import { Form, Button, Dropdown } from 'react-bootstrap';

const Pesquisa = ({ nomeDrop, lista = [], onFilterChange, onSearchChange, navega, TxtButton }) => {
  const [filtroSelecionado, setFiltroSelecionado] = useState('');

  const handleSelect = (value) => {
    setFiltroSelecionado(value);
    if (onFilterChange) onFilterChange(value); // '' representa "Todos"
  };

  const handleInputChange = (e) => {
    const texto = e.target.value;
    if (onSearchChange) onSearchChange(texto);
  };

  return (
    <div className="d-flex align-items-center mb-3">
      <Form.Control
        type="text"
        placeholder="Pesquisar..."
        onChange={handleInputChange}
        style={{ maxWidth: '300px', marginRight: '10px' }}
      />

      {lista.length > 0 && (
        <Dropdown onSelect={handleSelect} className="me-3">
          <Dropdown.Toggle variant="secondary" id="dropdown-filtro">
            {filtroSelecionado ? filtroSelecionado : nomeDrop}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item eventKey="">Todos</Dropdown.Item>
            {lista.map(({ texto, value }) => (
              <Dropdown.Item key={value} eventKey={value}>
                {texto}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      )}

      {navega && TxtButton && (
        <Button variant="success" onClick={() => window.location.href = navega}>
          {TxtButton}
        </Button>
      )}
    </div>
  );
};

export default Pesquisa;
