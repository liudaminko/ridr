import { useParams } from "react-router-dom";
import styles from "./SearchResults.module.css";
import Book from "../../components/Book/Book";
import SortingDropdown from "../../components/SortingDropdown/SortingDropdown";
import { useEffect, useState } from "react";

interface Book {
  id: number;
  title: string;
  price: number;
  authors: string;
  imageUrl: string;
  liked: boolean;
}

function SearchResults() {
  const { q } = useParams<{ q: string }>();

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log(q);
    const fetchBooks = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/catalog/search?keywords=${q}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error("Error fetching books:", error);
        setError("Failed to fetch books. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [q]);

  const handleSortChange = (option: string) => {
    console.log("Sorting by", option);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Search results "{q}"</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : (
        <div className={styles.searchResultContainer}>
          <div className={styles.header}>
            <h2>Found books: {books.length}</h2>
            <SortingDropdown onSortChange={handleSortChange} />
          </div>
          <div className={styles.booksContainer}>
            {books.map((book) => (
              <Book
                key={book.id}
                id={book.id}
                title={book.title}
                price={book.price}
                authors={book.authors}
                imageUrl={book.imageUrl}
                liked={book.liked}
                width="18%"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchResults;
