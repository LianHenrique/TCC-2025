import { useNavigate } from "react-router";
import styles from "../Components.module.css";

const NavBar = () => {

  const navigate = useNavigate()

  return (
    <nav className={styles.NavBar}>
      <h1 translate="no" onClick={() => {
        navigate("/home")
      }} className={styles.FullH1}>StoryBox</h1>
    </nav>
  );
};

export default NavBar;

