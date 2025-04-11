import { useEffect, useRef, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import styles from "./Alerta.module.css"

const AlertaLoginInvalido = (props) => {
    const [show, setShow] = useState(true);

    if (show) {
      return (
        <div className={styles.alerta}> 
            <Alert 
              variant={props.variante} 
              onClose={() => {
                setShow(false)
              }} 
              dismissible>

                <Alert.Heading>{props.titulo}</Alert.Heading>

                <p>{props.texto}</p>

              </Alert>
        </div>
      );
    }
  }

export default AlertaLoginInvalido