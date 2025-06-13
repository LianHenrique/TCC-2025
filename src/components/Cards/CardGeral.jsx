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
  onCardClick,
  showButtons = true,
  customButton,
  imgHeight,
}) => {
  return (
    <div className={ClassNameCard}>
      <h2>{filtro}</h2>
      <div className='d-flex' style={{
        overflowX: enableOverflow ? "auto" : "visible",
        borderRadius: "20px",
        padding: "5px"
      }}>
        {
          card.map((item, index) => (
            <Card
              key={index}
              className={`shadow`}
              onClick={() => onCardClick && onCardClick(item.id)}
              style={{
                minWidth: '15rem',
                maxWidth: "15rem",
                border: "none",
                borderRadius: "15px",
                margin: "6px",
                padding: "5px"
              }}>
              <div>
                <Card.Img
                  className={ClassImg}
                  style={{ borderRadius: "10px", height: { imgHeight } }}
                  variant="top"
                  src={item.link} />
                <Card.Body>
                  <Card.Title className={ClassTitulo}>{item.nome}</Card.Title>
                  {
                    item.descricao.map((desc, index) => (
                      <Card.Text key={index} className={Desc}>
                        {desc.texto}
                      </Card.Text>
                    ))
                  }
                  {showButtons
                    ? (
                      <>
                        <Button
                          variant="warning"
                          className="rounded-circle fs-5 text-center shadow m-1"
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="danger"
                          className="rounded-circle fs-5 text-center shadow"
                        >
                          <FaRegTrashAlt />
                        </Button>
                      </>
                    )
                    : customButton && customButton(item)
                  }
                </Card.Body>
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
            </Card>
          ))}
      </div>
    </div>
  );
};

export default CardGeral;