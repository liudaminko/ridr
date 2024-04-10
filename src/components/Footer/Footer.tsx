import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

function Footer() {
  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        <img src="/logo.svg" />
        <ul className={styles.column}>
          <Link to="/about">
            <li>about</li>
          </Link>
          <li>career</li>
          <li>contact</li>
        </ul>
        <ul className={styles.column}>
          <li>delivery and payment</li>
          <li>returns and refund</li>
          <li>blog</li>
        </ul>
      </div>

      <div className={styles.policyContainer}>
        <p>©2024 · all rights reserved</p>
        <p>ridr.com.ua</p>
      </div>
    </div>
  );
}

export default Footer;
