import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import SearchBar from "../SearchBar/SearchBar";

interface HeaderProps {
  onCartToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCartToggle }) => {
  return (
    <div className={styles.container}>
      <Link to="/">
        <img src="/logo2.svg" style={{ height: "2rem" }} alt="logo" />
      </Link>
      <SearchBar />
      <div className={styles.phoneCompound}>
        <div className={styles.phone}>
          <img src="/phone.png" style={{ height: "16px" }} alt="contacts" />
          <p className={styles.phoneNumber}>+380-93-567-20-00</p>
        </div>
        <p className={styles.schedule}>without weekends, 9 a.m. - 8 p.m.</p>
      </div>
      <div className={styles.userCompound}>
        <div className={styles.compound}>
          <Link to="/wishlist">
            <img src="/like.png" style={{ height: "24px" }} alt="wishlist" />
          </Link>
          <img
            src="/shopping-cart.png"
            style={{ height: "24px", cursor: "pointer" }}
            onClick={onCartToggle}
            alt="cart"
          />
        </div>
        <div className={styles.compound}>
          <button className={styles.logInButton}>log in</button>
          <button className={styles.signUpButton}>sign up</button>
        </div>
      </div>
    </div>
  );
};

export default Header;
