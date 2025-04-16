import styles from "../Components.module.css"
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

const NavBar = () => {
  return (
    <div 
    className={styles.NavBar}>
        <h1>StoryBox</h1>
        <div className={styles.DivButton}>
            <ButtonGroup>
                <Button className={styles.ButtonGroup}>Para quem</Button>
                <Button className={styles.ButtonGroup}>Soluções</Button>
                <Button className={styles.ButtonGroup}>Preços</Button>
            </ButtonGroup>
        </div>
        <div className={styles.BaseButtons}>
            <Button className={styles.Button}>Cadastro</Button>
            <Button className={styles.Button}>Login</Button>
        </div>
    </div>
  )
}

export default NavBar