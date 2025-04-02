import { useNavigate } from "react-router-dom"
import styles from "./EstoqueBarraFiltro.module.css"

const BarraFiltro = () => {
    const navigate = useNavigate()
  return (
    <div className={styles.body}>
        <div>
            {/* Botão para a tela funcionario */}
            <button 
            className={styles.buttonOtherPage}
            onClick={() => {
                navigate('/funcionario')
            }}>
                Funcionarios
            </button>
            {/* Botão indicativo da tela atual Estoque */}
            <button 
            className={styles.buttonAtual}>
                Estoque
            </button>
            {/* Botão para a tela Franquias */}
            <button 
            className={styles.buttonOtherPage}
            onClick={() => {
                navigate('/franquia')
            }}>
                Franquias
            </button>
        </div>
    </div>
  )
  
}

export default BarraFiltro