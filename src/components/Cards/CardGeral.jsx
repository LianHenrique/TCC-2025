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
      <h2>{filtro}</h2>
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
            key={index}
            className={`shadow`}
            onClick={() => onCardClick && onCardClick(item.id)}
            style={{
              minWidth: '15rem',
              maxWidth: '15rem',
              border: 'none',
              borderRadius: '15px',
              margin: '6px',
              padding: '5px',
              display: 'flex',
              flexDirection: 'column',
              cursor: onCardClick ? 'pointer' : 'default',
            }}
          >
            <Card.Img
              className={ClassImg}
              style={{ borderRadius: '10px', height: '200px', objectFit: 'cover', width: '100%' }}
              variant='top'
              src={item.link}
            />
            <Card.Body
              style={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
              }}
              onClick={e => e.stopPropagation()} // para evitar que o clique nos botões dispare o onClick do card
            >
              <Card.Title className={ClassTitulo}>{item.nome}</Card.Title>
              <div style={{ flexGrow: 1 }}>
                {item.descricao.map((desc, i) => (
                  <Card.Text key={i} className={Desc}>
                    {desc.texto}
                  </Card.Text>
                ))}
              </div>
              <div
                style={{
                  marginTop: 'auto',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '0.5rem',
                }}
              >
                <Button
                  variant='warning'
                  className='rounded-circle fs-5 text-center shadow m-1'
                  onClick={() => {
                    if (item.acoes && item.acoes[0]?.onClick) item.acoes[0].onClick();
                  }}
                >
                  <FaEdit />
                </Button>
                <Button
                  variant='danger'
                  className='rounded-circle fs-5 text-center shadow m-1'
                  onClick={() => {
                    if (item.acoes && item.acoes[1]?.onClick) item.acoes[1].onClick();
                  }}
                >
                  <FaRegTrashAlt />
                </Button>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CardGeral;