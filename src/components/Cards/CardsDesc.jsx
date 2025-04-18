import { Button } from "react-bootstrap"
import styles from "../Components.module.css"

const CardsDesc = (props) => {
  return (
    <div className={styles.DescOportunidade}>
      <h1>{props.titulo}</h1>
      <p>
      {props.desc}
      <br />
      <a href="#">sobre.</a>
      </p>
      {
      props.comBotão && 
        <div 
        className={styles.DivBotao}>
          <Button
          className={styles.BotaoEntrada}>
            {props.botaoTxt}
          </Button>
          <p>{props.txtComBotao}</p>
        </div>
      }
    </div>
  )
}

export default CardsDesc