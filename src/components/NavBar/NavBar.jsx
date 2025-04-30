import styles from "../Components.module.css"
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';


const NavBar = () => {

  const navItems = ["Para quem", "Soluções", "Preços"];

  return (
    <nav 
    className={styles.NavBar}>
      <h1 className={styles.FullH1}>StoryBox</h1>
      <div 
      className={styles.MinBaseButtons}>
        <h1 translate="no">StoryBox</h1>
        <div>
          <Button 
          className={styles.Button}>
            Cadastro</Button>
          <Button 
          className={styles.Button}>
            Login
          </Button>
        </div>
      </div>
      <div 
      className={styles.DivButton}>
        <ButtonGroup>
          {
            navItems.map((item, index) => (
              <Button 
              key={index} 
              className={styles.ButtonGroup}>
                {item}
              </Button>
            ))
          }
        </ButtonGroup>
      </div>
      <div 
      className={styles.FullBaseButtons}>
        <Button 
        className={styles.Button}>
          Cadastro</Button>
        <Button 
        className={styles.Button}>
          Login
        </Button>
      </div>
    </nav>
  )
}

export default NavBar