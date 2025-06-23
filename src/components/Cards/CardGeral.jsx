import { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';

const CardGeral = ({
  filtro,
  card = [],
  ClassNameCard,
  ClassTitulo,
  Desc,
  showButtons = false,
  customButton,
  onCardClick, // ← ADICIONADO
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
        {card.map((item, index) => (
          <div
            key={item.id || index}
            style={{
              width: layout === 'desktop' ? 'calc(50% - 0.5rem)' : '100%',
              minWidth: '300px',
            }}
          >
            <Card
              className={`shadow rounded d-flex ${
                layout === 'mobile' ? 'flex-column' : 'flex-row'
              }`}
              style={{
                minHeight: '200px',
                height: '100%',
                border: 'none',
                cursor: onCardClick ? 'pointer' : 'default', // cursor para indicar clique
              }}
              onClick={() => onCardClick?.(item.id)} // ← CHAMANDO A FUNÇÃO DE CLIQUE
            >
              <Card.Img
                className="rounded"
                style={{
                  width: layout === 'mobile' ? '100%' : '200px',
                  height: layout === 'mobile' ? '200px' : '150px',
                  objectFit: 'cover',
                  borderRadius:
                    layout === 'mobile' ? '20px 20px 0 0' : '0 0 0 20px',
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
                  item.descricao.map((desc, i) => (
                    <Card.Text key={i} className={Desc}>
                      {desc?.texto || ''}
                    </Card.Text>
                  ))}

                {customButton ? (
                  <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "end"
                  }}>
                    {customButton(item)}
                  </div>
                ) : showButtons && null}
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardGeral;
