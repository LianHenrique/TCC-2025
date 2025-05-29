import { Button, Card } from 'react-bootstrap'
import { FaEdit, FaRegTrashAlt } from 'react-icons/fa'

const CardGeral = ({ filtro, card, ClassNameCard, ClassTitulo , ClassImg, enableOverflow = true, Desc, onCardClick }) => {
  return (
    <div className={ClassNameCard}>
      <h2>{filtro}</h2>
      <div className='d-flex' style={{
        overflowX: enableOverflow ? "auto" : "visible",
        borderRadius: "20px"
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
                  style={{ borderRadius: "10px" }}
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
                  <Button
                    variant="warning"
                    className="rounded-circle fs-5 text-center shadow m-1">
                    <FaEdit />
                  </Button>
                  <Button
                    variant="danger"
                    className="rounded-circle fs-5 text-center shadow">
                    <FaRegTrashAlt />
                  </Button>
                </Card.Body>
              </div>
            </Card>
          ))
        }
      </div>
    </div>
  )
}

export default CardGeral