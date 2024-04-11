import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SearchBar.module.css";

function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const history = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      history(`/search/${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className={styles.container}>
      <input
        type="text"
        className={styles.input}
        placeholder="search books, authors, ISBN ..."
        value={searchQuery}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
      />
      <div className={styles.searchButton} onClick={handleSearch}>
        <img src="/search.png" style={{ height: "1rem" }} alt="Search" />
      </div>
    </div>
  );
}

export default SearchBar;
