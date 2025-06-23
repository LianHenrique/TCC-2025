import { useState } from 'react';
import { Form, Button, Dropdown } from 'react-bootstrap';

const Pesquisa = ({ nomeDrop, lista, onFilterChange, onSearchChange, navega, TxtButton }) => {
  const [filtroSelecionado, setFiltroSelecionado] = useState('Todos');
  const [textoBusca, setTextoBusca] = useState('');

  const handleSelect = (value) => {
    setFiltroSelecionado(value);
    if(onFilterChange) onFilterChange(value);
  };

  const handleInputChange = (e) => {
    const texto = e.target.value;
    setTextoBusca(texto);
    if(onSearchChange) onSearchChange(texto);
  };

  return (
    <div className="d-flex align-items-center mb-3">
      <Form.Control
        type="text"
        placeholder="Pesquisar..."
        value={textoBusca}
        onChange={handleInputChange}
        style={{ maxWidth: '300px', marginRight: '10px' }}
      />

      {lista && (
        <Dropdown onSelect={handleSelect} className="me-3">
          <Dropdown.Toggle variant="secondary" id="dropdown-filtro">
            {filtroSelecionado === 'Todos' ? nomeDrop : filtroSelecionado}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item eventKey="Todos">Todos</Dropdown.Item>
            {lista.map(({ texto, value }) => (
              <Dropdown.Item key={value} eventKey={value}>
                {texto}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      )}

      {navega && TxtButton && (
        <Button variant="primary" onClick={() => window.location.href = navega}>
          {TxtButton}
        </Button>
      )}
    </div>
  );
};

export default Pesquisa;