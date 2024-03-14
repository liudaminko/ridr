import styles from "./SearchBar.module.css";

function SearchBar() {
  return (
    <div className={styles.container}>
      <input
        type="text"
        className={styles.input}
        placeholder="search books, authors, ISBN ..."
      />
      <div className={styles.searchButton}>
        <img src="search.png" style={{ height: "1rem" }} />
      </div>
    </div>
  );
}

export default SearchBar;
