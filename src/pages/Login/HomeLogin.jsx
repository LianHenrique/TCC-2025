import { useState } from "react";
import styles from "./HomeLogin.module.css"

const HomeLogin = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  console.log("email:", email);
  console.log("senha:", senha);

  return (
    <div className={styles.body}>
      <div className={styles.body}>
        <div className={styles.bodyLogin}>
          <div>
            <input className={styles.inputLogin} type="text" placeholder="E-mail" onChange={(e) => {
              setEmail(e.target.value)
            }} />
          </div>
          <div>
            <input className={styles.inputLogin} type="password" placeholder="Senha" onChange={(e) => {
              setSenha(e.target.value)
            }}/>
          </div>
          <div>
            <button className={styles.buttonLogin}>Entrar</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeLogin