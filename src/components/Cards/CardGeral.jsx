import { Button, Card } from 'react-bootstrap'
import { FaEdit, FaRegTrashAlt } from 'react-icons/fa'

const CardGeral = ({filtro, card}) => {
  return (
    <div>
      <h2>{filtro}</h2>
      <div className='d-flex' style={{
        overflowX:"auto",
        borderRadius:"20px"
      }}>
          {
            card.map((item, index) => (
              <Card 
              key={index}
              className='shadow'  
              style={{ 
                minWidth: '15rem',
                maxWidth: "15rem", 
                border: "none",
                borderRadius: "15px", 
                margin: "6px", 
                padding: "5px" 
                }}>
                <Card.Img 
                style={{borderRadius: "10px"}} 
                variant="top" 
                src={item.link} />
                <Card.Body>
                  <Card.Title>{item.nome}</Card.Title>
                  {
                    item.descricao.map((desc, index) => (
                      <Card.Text key={index}>
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
              </Card>
            ))
          }
      </div>
    </div>
  )
}

export default CardGeral