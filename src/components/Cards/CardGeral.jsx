import { Button, Card } from 'react-bootstrap';
import { FaEdit, FaRegTrashAlt } from 'react-icons/fa';

const CardGeral = ({
  filtro,
  card = [], // Garante que card sempre seja um array
  ClassNameCard,
  ClassTitulo,
  ClassImg,
  enableOverflow = true,
  Desc,
  onCardClick,
  showButtons = true,
  customButton,
  imgHeight = '180px', // valor padrão para imagem
}) => {
  return (
    <div className={ClassNameCard}>
      {filtro && <h2>{filtro}</h2>}

      <div
        className='d-flex'
        style={{
          overflowX: enableOverflow ? 'auto' : 'visible',
          borderRadius: '20px',
          padding: '5px',
        }}
      >
        {card.map((item, index) => (
          <Card
            key={item.id || index}
            className='shadow'
            onClick={() => onCardClick?.(item.id)}
            style={{
              minWidth: '15rem',
              maxWidth: '15rem',
              border: 'none',
              borderRadius: '15px',
              margin: '6px',
              padding: '5px',
              cursor: onCardClick ? 'pointer' : 'default',
            }}
          >
            <Card.Img
              className={ClassImg}
              style={{ borderRadius: '10px', height: imgHeight, objectFit: 'cover' }}
              variant='top'
              src={item.link}
              alt={item.nome}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg';
              }}
            />

            <Card.Body>
              <Card.Title className={ClassTitulo}>{item.nome}</Card.Title>

              {Array.isArray(item.descricao) &&
                item.descricao.map((desc, i) => (
                  <Card.Text key={i} className={Desc}>
                    {desc?.texto || ''}
                  </Card.Text>
                ))}

              {customButton ? (
                customButton(item)
              ) : showButtons ? (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '0.5rem',
                  }}
                >
                  <Button
                    variant='warning'
                    className='rounded-circle fs-5 text-center shadow m-1'
                    onClick={(e) => {
                      e.stopPropagation();
                      item.acoes?.[0]?.onClick?.();
                    }}
                  >
                    <FaEdit />
                  </Button>

                  <Button
                    variant='danger'
                    className='rounded-circle fs-5 text-center shadow m-1'
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
        ))}
      </div>
    </div>
  );
};

export default CardGeral;