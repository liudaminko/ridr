import { Link } from "react-router-dom";
import styles from "./Book.module.css";

interface BookProps {
  id: number;
  imageUrl: string;
  authors: string;
  title: string;
  price: number;
  liked: boolean;
  width: string;
}

function Book({
  id,
  imageUrl,
  authors,
  title,
  price,
  liked,
  width,
}: BookProps) {
  const handleLikeClick = (event: React.MouseEvent<HTMLImageElement>) => {
    event.stopPropagation();
    event.preventDefault();
    console.log("Liked:", id);
  };

  return (
    <Link to={`/book/${id}`} className={styles.link} style={{ width }}>
      <div className={styles.container}>
        {liked ? (
          <img
            src="/liked.png"
            className={styles.likeBook}
            alt="liked"
            onClick={handleLikeClick}
          />
        ) : (
          <img
            src="/like.png"
            className={styles.likeBook}
            alt="like"
            onClick={handleLikeClick}
          />
        )}

        <div className={styles.cover}>
          <img src={imageUrl} alt="cover" className={styles.coverImage} />
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
