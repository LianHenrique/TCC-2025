import { Button } from "react-bootstrap"
import styles from "../Components.module.css"

const CardsCurso = (props) => {
  return (
    <div className={styles.PlanoCard}>
      <div className={styles.BaseCards}>
          {
            props.cards.map((card, index) => (
              <div key={index} className={styles.Card}>
                <h2>{card.titulo}</h2>
                <p>{card.req1}</p>
                <p>{card.req2}</p>
                <p>{card.req3}</p>
                <div 
                className={styles.BaseButton}>
                  <Button
                  className={styles.Button}>
                    Entrar
                  </Button>
                </div>
              </div>
            ))
          }
      </div>
    </div>
  )
}

export default CardsCurso