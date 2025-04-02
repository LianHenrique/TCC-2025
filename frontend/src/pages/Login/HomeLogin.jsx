import { useState } from "react";
import styles from "./HomeLogin.module.css"
import { useNavigate } from "react-router-dom";

const HomeLogin = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const navigate = useNavigate();

  const aoClicar = () => {
    if (email == "ADM" && senha == "ADM") {
      navigate('/estoque');
    }
    else{
      alert("Login invalido (testes no momento)")
      alert("Login ADM senha ADM")
    }
  }

  return (
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
  )
}

export default HomeLogin