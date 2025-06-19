import { useEffect, useState } from 'react';
import { Button, Card } from 'react-bootstrap';
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

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '10px',
        }}
      >
        {card.map((item, index) => {
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
                  border: 'none',
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
                    e.target.src =
                      'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg';
                  }}
                />

                <Card.Body style={{ flex: 1, overflowY: 'auto' }}>
                  <Card.Title className={ClassTitulo}>{item.nome}</Card.Title>

                  {Array.isArray(item.descricao) &&
                    item.descricao.map((desc, i) => {
                      const isVencimento = desc.texto?.toLowerCase().includes('vencimento');
                      const isQuantidade = desc.texto?.toLowerCase().includes('quantidade');
                      const isDanger = desc.badge === 'danger';

                      const aplicarFundoQuantidade = isDanger && isQuantidade;
                      const aplicarFundoVencimento = isDanger && isVencimento;

                      return (
                        <Card.Text
                          key={i}
                          className={Desc}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            backgroundColor: (aplicarFundoQuantidade || aplicarFundoVencimento) ? '#f5c6cb' : 'transparent',
                            color: (aplicarFundoQuantidade || aplicarFundoVencimento) ? '#8a1c1c' : 'inherit',
                            borderRadius: (aplicarFundoQuantidade || aplicarFundoVencimento) ? '6px' : '0',
                            padding: (aplicarFundoQuantidade || aplicarFundoVencimento) ? '6px 10px' : '0',
                            ...(desc.style || {})
                          }}
                          title={aplicarFundoVencimento ? 'Este produto vence em até 10 dias' : ''}
                        >
                          <span>{desc?.texto || ''}</span>
                          {aplicarFundoVencimento && (
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

                  {customButton ? (
                    customButton(item)
                  ) : showButtons ? (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '0.5rem',
                        marginTop: '10px',
                      }}
                    >
                      <Button
                        variant="warning"
                        className="rounded-circle fs-5 text-center shadow m-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          item.acoes?.[0]?.onClick?.();
                        }}
                      >
                        <FaEdit />
                      </Button>

                      <Button
                        variant="danger"
                        className="rounded-circle fs-5 text-center shadow m-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          item.acoes?.[1]?.onClick?.();
                        }}
                      >
                        <FaRegTrashAlt />
                      </Button>
                    </div>
                  ) : null}
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
