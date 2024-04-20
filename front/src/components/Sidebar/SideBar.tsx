import { Link } from "react-router-dom";
import styles from "./SideBar.module.css";

function SideBar() {
  const categories = ["classics", "poetry", "fantasy", "nonfiction", "horror"];

  return (
    <div className={styles.container}>
      <h3 className={styles.header}>genres</h3>
      <Link to="/catalog">
        <p>all</p>
      </Link>
      {categories.map((category, index) => (
        <div key={index} className={styles.category}>
          <p>{category}</p>
        </div>
      ))}
    </div>
  );
}

export default SideBar;
