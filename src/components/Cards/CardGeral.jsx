import { useEffect, useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { FaEdit, FaRegTrashAlt } from 'react-icons/fa';

const CardGeral = ({
  filtro,
  card = [],
  ClassNameCard,
  ClassTitulo,
  Desc,
  showButtons = false,
  customButton,
  onCardClick,
}) => {
  const [layout, setLayout] = useState('desktop');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 576) setLayout('mobile');
      else if (width < 992) setLayout('split');
      else setLayout('desktop');
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={ClassNameCard} style={{ width: '100%' }}>
      {filtro && <h2>{filtro}</h2>}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', padding: '10px' }}>
        {card.map((item, index) => {
          const isDisabled = item.estoqueInsuficiente;

          return (
            <div
              key={item.id || index}
              style={{
                width: layout === 'desktop' ? 'calc(50% - 0.5rem)' : '100%',
                minWidth: '300px',
              }}
            >
              <Card
                className={`shadow rounded d-flex ${layout === 'mobile' ? 'flex-column' : 'flex-row'}`}
                style={{
                  minHeight: '200px',
                  height: '100%',
                  cursor: onCardClick ? 'pointer' : 'default',
                }}
                onClick={() => onCardClick?.(item.id)}
              >
                <Card.Img
                  className="rounded"
                  style={{
                    width: layout === 'mobile' ? '100%' : '200px',
                    height: layout === 'mobile' ? '200px' : '150px',
                    objectFit: 'cover',
                    borderRadius: layout === 'mobile' ? '20px 20px 0 0' : '0 0 0 20px',
                    flexShrink: 0,
                  }}
                  variant="top"
                  src={item.link}
                  alt={item.nome}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg';
                  }}
                />

                <Card.Body style={{ flex: 1, position: 'relative' }}>
                  <Card.Title className={ClassTitulo}>{item.nome}</Card.Title>

                  {Array.isArray(item.descricao) &&
                    item.descricao.map((desc, i) => {
                      const isVencimento = desc.texto?.toLowerCase().includes('vencimento');
                      const isQuantidade = desc.texto?.toLowerCase().includes('quantidade');
                      const isDanger = desc.badge === 'danger';
                      const aplicarFundo = isDanger && (isVencimento || isQuantidade);

                      return (
                        <Card.Text
                          key={i}
                          className={Desc}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            backgroundColor: aplicarFundo ? '#f5c6cb' : 'transparent',
                            color: aplicarFundo ? '#8a1c1c' : 'inherit',
                            borderRadius: aplicarFundo ? '6px' : '0',
                            padding: aplicarFundo ? '6px 10px' : '0',
                            ...(desc.style || {}),
                          }}
                          title={desc.tooltip || ''}
                        >
                          <span>
                            {desc.texto?.toLowerCase().includes('quantidade')
                              ? (() => {
                                const match = desc.texto.match(/quantidade:\s*([\d.,]+)\s*(\w+)?/i);
                                const valor = match?.[1] ? parseFloat(match[1].replace(',', '.')) : null;
                                const unidade = match?.[2] || '';
                                return valor !== null
                                  ? `Quantidade: ${valor.toLocaleString('pt-BR', {
                                    minimumFractionDigits: valor % 1 === 0 ? 0 : 2,
                                    maximumFractionDigits: 3,
                                  })} ${unidade}`
                                  : desc.texto;
                              })()
                              : desc.texto}
                          </span>
                          {desc.badge && (
                            <span
                              style={{
                                backgroundColor: '#8a1c1c',
                                color: 'white',
                                borderRadius: '8px',
                                padding: '2px 8px',
                                fontSize: '0.8rem',
                                marginLeft: '8px',
                              }}
                            >
                              Vencendo
                            </span>
                          )}
                        </Card.Text>
                      );
                    })}

                  {isDisabled && (
                    <div className="d-flex flex-column align-items-center justify-content-center mt-3">
                      <div
                        style={{
                          backgroundColor: '#e74c3c',
                          color: '#fff',
                          fontWeight: 'bold',
                          padding: '10px',
                          borderRadius: '30px',
                          fontSize: '1rem',
                          boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.2)',
                        }}
                      >
                        Estoque insuficiente
                      </div>
                      <Button
                        variant="outline-danger"
                        className="rounded-pill px-4 py-2"
                        style={{ fontWeight: 'bold' }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          window.location.href = '/estoque';
                        }}
                      >
                        Ver Estoque
                      </Button>
                    </div>
                  )}

                  {!isDisabled &&
                    (customButton ? (
                      <div
                        style={{
                          display: 'flex',
                          width: "100%",
                          justifyContent: "end"
                        }}
                      >

                        {customButton(item)}

                      </div>
                    ) : null)}
                </Card.Body>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CardGeral;
