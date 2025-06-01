import { Button, Card } from 'react-bootstrap';
import { FaEdit, FaRegTrashAlt } from 'react-icons/fa';

const CardGeral = ({
  filtro,
  card,
  ClassNameCard,
  ClassTitulo,
  ClassImg,
  enableOverflow = true,
  Desc,
  onCardClick
}) => {
  return (
    <div className={ClassNameCard}>
      {filtro && <h2 className="mb-3">{filtro}</h2>}

      <div
        className="d-flex flex-nowrap"
        style={{
          overflowX: enableOverflow ? 'auto' : 'visible',
          borderRadius: '20px',
          gap: '10px'
        }}
      >
        {card.map((item, index) => (
          <Card
            key={index}
            className="shadow"
            style={{
              minWidth: '15rem',
              maxWidth: '15rem',
              border: 'none',
              borderRadius: '15px',
              padding: '5px',
              cursor: onCardClick ? 'pointer' : 'default'
            }}
            onClick={() => onCardClick && onCardClick(item.id)}
          >
            <Card.Img
              className={ClassImg}
              style={{ borderRadius: '10px', height: '180px', objectFit: 'cover' }}
              variant="top"
              src={item.link}
              alt={item.nome}
            />

            <Card.Body>
              <Card.Title className={ClassTitulo}>{item.nome}</Card.Title>

              {item.descricao?.map((desc, i) => (
                <Card.Text key={i} className={Desc}>
                  {desc.texto ?? desc.componente}
                </Card.Text>
              ))}

              {/* Botões de ação, se existirem */}
              {item.acoes && (
                <div className="d-flex gap-2 mt-2">
                  {item.acoes.map((acao, i) => (
                    <Button
                      key={i}
                      variant={acao.variant || 'secondary'}
                      className="rounded-circle fs-5 text-center shadow"
                      onClick={(e) => {
                        e.stopPropagation(); // impedir navegação ao clicar nos ícones
                        acao.onClick?.();
                      }}
                    >
                      {acao.icone}
                    </Button>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CardGeral;