import { useState } from "react";
import styles from "./CategoryProposal.module.css";
import { useNavigate } from "react-router-dom";

interface Category {
  name: string;
  image?: string;
}

function CategoryProposal() {
  const categories: Category[] = [
    { name: "sale", image: "fire.png" },
    { name: "new books" },
    { name: "best sellers" },
    { name: "our recommendations" },
    { name: "fiction" },
    { name: "nonfiction" },
    { name: "kids" },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const history = useNavigate();

  const handleSearch = (category: string) => {
    if (searchQuery.trim() !== "") {
      history(`/search/${category}`);
    }
  };

  return (
    <div className={styles.container}>
      {categories.map((category, index) => (
        <div
          key={index}
          className={styles.category}
          onClick={() => handleSearch(category.name)}
        >
          {category.name}

          {index === 0 && category.image && (
            <img
              src={category.image}
              alt={`${category.name} category`}
              style={{ height: "1rem" }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default CategoryProposal;
