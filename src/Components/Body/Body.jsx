import { useEffect, useRef, useState } from "react"
import styles from "./Body.module.css"
import Alerta from "../Alerta/Alerta"

const Body = () => {
  const [alerta, setAlerta] = useState(false);
  const alertaRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (alertaRef.current && !alertaRef.current.contains(event.target)) {
        setAlerta(false);
      }
    }
    
    if (alerta) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [alerta]);

  return (
    // Adicionar as informações necessarias
    <div 
    className={styles.Body}>
      {alerta && (
        <div ref={alertaRef} className={styles.alertWrapper}>
          <Alerta 
            titulo="Tela não criada" 
            texto="Esta tela ainda não foi criada, por favor aguarde atualizações futuras." 
            variante="warning" 
          />
        </div>
      )}
        <div 
        className={styles.basePesquisa}>
            <input 
            type="text" 
            placeholder="Pesquisa" />
            <button 
            className={styles.buttonCadastro}
            onClick={() => {
              setAlerta(false)
              setTimeout(() => {
                setAlerta(true)
              }, 10);
            }}>
              Cadastrar
            </button>
        </div>
    </div>
  )

}

export default Body