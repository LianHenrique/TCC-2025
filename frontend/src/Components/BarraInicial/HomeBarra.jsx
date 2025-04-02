import styles from "./HomeBarra.module.css"
import { HiEllipsisHorizontal } from "react-icons/hi2";

const Home = (props) => {

  return (
    // corpo do site
    <div className={styles.body}>
      {/* Ideia que talvez n usaremos */}
      
      {/* <button 
      className={styles.button}
      onClick={() => {
        props.useMenuAberto(!props.menuAberto)
      }}>
        <HiEllipsisHorizontal />
      </button> */}
    </div>
  )
}

export default Home