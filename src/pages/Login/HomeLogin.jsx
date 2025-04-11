import { useEffect, useRef, useState } from "react";
import styles from "./HomeLogin.module.css"
import { useNavigate } from "react-router-dom";
import Alerta from "../../Components/Alerta/Alerta";


const HomeLogin = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [loginInvalido, setLoginInvalido] = useState(false);

  const navigate = useNavigate();

  const alertaRef = useRef(null);

  useEffect(() => {
      function handleClickOutside(event) {
        if (alertaRef.current && !alertaRef.current.contains(event.target)) {
          setLoginInvalido(false);
        }
      }
      
      if (loginInvalido) {
        document.addEventListener("mousedown", handleClickOutside);
      }
      
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [loginInvalido]);

  const logar = () => {
    if (email == "ADM" && senha == "ADM") {
      navigate('/estoque')
    }
    else{
      setLoginInvalido(false)
      setTimeout(() => {
        setLoginInvalido(true)
      }, 10)
    }
  }

  return (
      <div>
          {loginInvalido && (
            <div ref={alertaRef} className={styles.alertWrapper}>
              <Alerta 
                titulo="Tela não criada" 
                texto="Esta tela ainda não foi criada, por favor aguarde atualizações futuras." 
                variante="warning" 
              />
            </div>
          )}
        <div className={styles.body}>
          <h1>Login</h1>
            <input className={styles.input} type="text" placeholder="E-mail" onChange={(e) => {
              setEmail(e.target.value)
              setLoginInvalido(false)
            }} />
            <input className={styles.input} type="password" placeholder="Senha" onChange={(e) => {
              setSenha(e.target.value)
              setLoginInvalido(false)
            }}/>
          <button className={styles.button} onClick={logar}>Entrar</button>
        </div>
      </div>
  )
}

export default HomeLogin