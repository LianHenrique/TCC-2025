import { useNavigate } from "react-router-dom"
import styles from "./FranquiasBarraFiltro.module.css"

const BarraFiltro = () => {

    const navigate = useNavigate();

    const funcionario = () => {
        navigate('/funcionario');
    }
    const estoque = () => {
        navigate('/estoque');
    }

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
                className={styles.buttonOtherPage}
                onClick={() => {
                    navigate('/Estoque')
                }}>
                Estoque
            </button>
            {/* Botão para a tela Franquias */}
            <button 
            className={styles.buttonAtual}>
                Franquias
            </button>
        </div>
    </div>
  )
  
}

export default BarraFiltro