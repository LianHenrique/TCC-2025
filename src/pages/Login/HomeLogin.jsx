import { useState } from "react";
import styles from "./HomeLogin.module.css"
import { useNavigate } from "react-router-dom";
import AlertaLoginInvalido from "../../Components/AlertaLogin/AlertaLoginInvalido";


const HomeLogin = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const navigate = useNavigate();

  const aoClicar = () => {
    if (email == "ADM" && senha == "ADM") {
      navigate('/estoque');
    }
    else{
      <AlertaLoginInvalido />
    }
  }

  return (
    <div>
      <AlertaLoginInvalido />
      <div className={styles.body}>
        <h1>Login</h1>
        <div>
          <input className={styles.input} type="text" placeholder="E-mail" onChange={(e) => {
            setEmail(e.target.value)
          }} />
        </div>
        <div>
          <input className={styles.input} type="password" placeholder="Senha" onChange={(e) => {
            setSenha(e.target.value)
          }}/>
          </div>
        <button className={styles.button} onClick={aoClicar}>Entrar</button>
      </div>
    </div>
  )
}

export default HomeLogin