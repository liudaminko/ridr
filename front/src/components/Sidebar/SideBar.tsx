import { Link, useNavigate } from "react-router-dom";
import styles from "./SideBar.module.css";
import { useEffect, useState } from "react";

interface Genre {
  id: number;
  name: string;
}

function SideBar() {
  const [categories, setCategories] = useState<Genre[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPopularGenres = async () => {
      try {
        const response = await fetch(`http://localhost:8080/genre/popular`);
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchPopularGenres();
  }, []);

  const handleGenreClick = (genreId: number) => {
    navigate(`/catalog?genre=${genreId}`);
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.header}>Popular genres</h3>
      <Link to="/catalog" className={styles.link}>
        <p>All</p>
      </Link>
      {categories.map((category, index) => (
        <div
          key={index}
          className={styles.category}
          onClick={() => handleGenreClick(category.id)}
        >
          <p key={category.id}>{category.name}</p>
        </div>
      ))}
    </div>
  );
}

export default SideBar;
