import { Button } from "react-bootstrap"
import styles from "../Components.module.css"

const CardsCurso = (props) => {
  return (
    <div className={styles.Cards}>
        <div className={styles.CardCurso}>
            <h1>{props.titulo}</h1>
            <p>{props.req1}</p>
            <p>{props.req2}</p>
            <p>{props.req3}</p>
            <Button>Entrar</Button>
        </div>
    </div>
  )
}

export default CardsCurso