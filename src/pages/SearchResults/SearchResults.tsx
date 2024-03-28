import { useParams } from "react-router-dom";
import styles from "./SearchResults.module.css";
import Book from "../../components/Book/Book";
import SortingDropdown from "../../components/SortingDropdown/SortingDropdown";

function SearchResults() {
  const { q } = useParams<{ q: string }>();

  //mock data for search results by word "flower"
  const books = [
    {
      id: 1,
      title: "The Language of Flowers",
      authors: "Vanessa Diffenbaugh",
      price: 12.99,
      image_url: "https://example.com/language_of_flowers.jpg",
      liked: true,
    },
    {
      id: 2,
      title: "Flower Fairies of the Spring",
      authors: "Cicely Mary Barker",
      price: 10.49,
      image_url: "https://example.com/flower_fairies_spring.jpg",
      liked: false,
    },
    {
      id: 3,
      title: "Flower Arranging for Beginners",
      authors: "Judith Blacklock",
      price: 9.99,
      image_url: "https://example.com/flower_arranging_beginners.jpg",
      liked: true,
    },
    {
      id: 5,
      title: "Flower Power",
      authors: "Lauren Myracle",
      price: 8.99,
      image_url: "https://example.com/flower_power.jpg",
      liked: true,
    },
    {
      id: 6,
      title: "Flower Confidential",
      authors: "Amy Stewart",
      price: 9.99,
      image_url: "https://example.com/flower_confidential.jpg",
      liked: false,
    },
    {
      id: 7,
      title: "The Flower Workshop",
      authors: "Ariella Chezar",
      price: 10.99,
      image_url: "https://example.com/flower_workshop.jpg",
      liked: true,
    },
  ];

  const handleSortChange = (option: string) => {
    console.log("Sorting by", option);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Search results "{q}"</h1>
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
              imageUrl={book.image_url}
              liked={book.liked}
              width="18%"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default SearchResults;
