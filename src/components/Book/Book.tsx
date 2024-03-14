import styles from "./Book.module.css";

interface BookProps {
  id: number;
  imageUrl: string;
  authors: string;
  title: string;
  price: number;
}

function Book({ imageUrl, authors, title, price }: BookProps) {
  return (
    <div className={styles.container}>
      <div className={styles.cover}>
        <img src={imageUrl} alt="cover" className={styles.coverImage} />
      </div>
      <div className={styles.info}>
        <p className={styles.author}>{authors}</p>
        <p className={styles.title}>{title}</p>
        <p className={styles.price}>${price}</p>
      </div>
    </div>
  );
}

export default Book;
