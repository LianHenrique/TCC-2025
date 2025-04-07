import { useNavigate } from "react-router-dom"
import styles from "./BarraFiltro.module.css"

const BarraFiltro = (props) => {
    const navigate = useNavigate()
  return (
    <div className={styles.body}>
        <div>
            {/* Botão para a tela funcionario */}
            <button 
            className={props.id == 1 ? styles.buttonAtual : styles.buttonOtherPage}
            onClick={() => {
                navigate('/funcionario')
            }}>
                Funcionarios
            </button>
            {/* Botão indicativo da tela atual Estoque */}
            <button 
            className={props.id == 2 ? styles.buttonAtual : styles.buttonOtherPage}
            onClick={() => {
                navigate('/estoque')
            }}>
                Estoque
            </button>
            <button 
            className={props.id == 3 ? styles.buttonAtual : styles.buttonOtherPage}
            onClick={() => {
                navigate('/relatorio')
            }}>
                Relatorio
            </button>
        </div>
    </div>
  )
  
}

export default BarraFiltro