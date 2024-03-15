import { Link } from "react-router-dom";
import styles from "./Book.module.css";

interface BookProps {
  id: number;
  imageUrl: string;
  authors: string;
  title: string;
  price: number;
}

function Book({ id, imageUrl, authors, title, price }: BookProps) {
  const handleLikeClick = (event: React.MouseEvent<HTMLImageElement>) => {
    event.stopPropagation(); // Prevent the click event from bubbling up to the parent container
    event.preventDefault();
    console.log("Liked:", id); // Log the ID of the item
  };

  return (
    <Link to={`/book/${id}`} className={styles.link}>
      <div className={styles.container}>
        <img
          src="/like.png"
          className={styles.likeBook}
          alt="like"
          onClick={handleLikeClick}
        />
        <div className={styles.cover}>
          <img
            src={imageUrl}
            alt="cover"
            className={styles.coverImage}
            style={{ height: "160px" }}
          />
        </div>
        <div className={styles.info}>
          <p className={styles.author}>{authors}</p>
          <p className={styles.title}>{title}</p>
          <p className={styles.price}>${price}</p>
        </div>
      </div>
    </Link>
  );
}

export default Book;
