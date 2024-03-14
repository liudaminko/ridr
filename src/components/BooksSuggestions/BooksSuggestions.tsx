import { useState } from "react";
import styles from "./BooksSuggestions.module.css";
import Book from "../Book/Book";

interface BookType {
  id: number;
  imageUrl: string;
  authors: string;
  title: string;
  price: number;
}

interface BooksSuggestionsProps {
  books: BookType[];
  title: string;
  backgroundColor: string;
  categoryBackgroundColor: string;
}

function BooksSuggestions({
  books,
  title,
  backgroundColor,
  categoryBackgroundColor,
}: BooksSuggestionsProps) {
  const initialVisibleBooks = 5;
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(initialVisibleBooks);

  const showNextBooks = () => {
    if (end < books.length) {
      setStart(start + 1);
      setEnd(end + 1);
    }
  };

  const showPreviousBooks = () => {
    if (start > 0) {
      setStart(start - 1);
      setEnd(end - 1);
    }
  };

  return (
    <div className={styles.container} style={{ backgroundColor }}>
      <div
        className={styles.header}
        style={{ backgroundColor: categoryBackgroundColor }}
      >
        <h3>{title}</h3>
      </div>
      <div className={styles.slider}>
        <button className={styles.button} onClick={showPreviousBooks}>
          <img src="prev.png" style={{ height: "16px" }} alt="Previous" />
        </button>
        <div className={styles.booksContainer}>
          {books.slice(start, end).map((book, index) => (
            <Book
              key={index}
              id={book.id}
              imageUrl={book.imageUrl}
              authors={book.authors}
              title={book.title}
              price={book.price}
            />
          ))}
        </div>
        <button className={styles.button} onClick={showNextBooks}>
          <img src="next.png" style={{ height: "16px" }} alt="Next" />
        </button>
      </div>
    </div>
  );
}

export default BooksSuggestions;
