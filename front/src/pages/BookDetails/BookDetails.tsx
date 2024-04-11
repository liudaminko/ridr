import styles from "./BookDetails.module.css";
import { useParams } from "react-router-dom";
import { useState } from "react";
import AddToCartButton from "../../components/AddToCartButton/AddToCartButton";

function BookDetails() {
  const { id } = useParams<{ id: string }>();
  const [isFullDescription, setFullDescription] = useState(false);
  const [isBookDetailsOpened, setBookDetailsOpen] = useState(false);

  const fullInfoBook = {
    id: 1,
    imageUrl: "9780060935467",
    title: "To Kill A Mockingbird",
    authors: [
      {
        id: 1,
        name: "Harper Lee",
      },
      {
        id: 2,
        name: "",
      },
    ],
    description:
      'The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it. "To Kill A Mockingbird" became both an instant bestseller and a critical success when it was first published in 1960. It went on to win the Pulitzer Prize in 1961 and was later made into an Academy Award-winning film, also a classic.Compassionate, dramatic, and deeply moving, "To Kill A Mockingbird" takes readers to the roots of human behavior - to innocence and experience, kindness and cruelty, love and hatred, humor and pathos. Now with over 18 million copies in print and translated into forty languages, this regional story by a young Alabama woman claims universal appeal. Harper Lee always considered her book to be a simple love story. Today it is regarded as a masterpiece of American literature.',
    price: 10,
    genre: "classics",
    pages: 336,
    publicationYear: 2016,
    publisher: {
      id: 1,
      name: "Perennial Classics",
    },
    ISBN: 935923058203,
    language: "eng",
  };
  const bookAvailability = {
    available: true,
  };

  const handleViewMoreClick = () => {
    setFullDescription(!isFullDescription);
  };
  const handleBookDetailsClick = () => {
    setBookDetailsOpen(!isBookDetailsOpened);
  };

  const handleAddToCartClick = () => {
    console.log("added to cart:", fullInfoBook.id);
  };

  const handleLikeButtonClick = () => {
    console.log("liked:", fullInfoBook.id);
  };

  return (
    <div className={styles.container}>
      <div className={styles.cover}>
        <div className={styles.tags}></div>
        <img
          src="/9780060935467.jpeg"
          alt="cover"
          className={styles.coverImage}
        />
      </div>
      <div className={styles.infoContainer}>
        <h3 className={styles.bookPath}>
          All books / Fiction / Classics / {fullInfoBook.title}
        </h3>
        <div className={styles.mainInfo}>
          <h1 className={styles.title}>{fullInfoBook.title}</h1>
          {fullInfoBook.authors.map((author, index) => (
            <h2 key={index} className={styles.author}>
              {author.name}
            </h2>
          ))}
        </div>
        <div className={styles.descriptionContainer}>
          <p
            className={styles.description}
            style={{ height: isFullDescription ? "auto" : "84px" }}
          >
            {fullInfoBook.description}
          </p>
          {fullInfoBook.description.length > 200 && (
            <div
              className={styles.viewMoreButton}
              onClick={handleViewMoreClick}
            >
              <p>{isFullDescription ? "view less" : "view more"}</p>
              <img
                src={
                  isFullDescription
                    ? "/opened_orange.png"
                    : "/closed_orange.png"
                }
                style={{ height: "24px" }}
                alt="toggle"
              />
            </div>
          )}
        </div>
        <div className={styles.bookDetailsContainer}>
          <div
            className={styles.viewMoreButton}
            onClick={handleBookDetailsClick}
          >
            <h3>Book details</h3>
            <img
              src={isBookDetailsOpened ? "/opened.png" : "/closed.png"}
              style={{ height: "24px" }}
              alt="toggle"
            />
          </div>
          {isBookDetailsOpened && (
            <div className={styles.bookDetails}>
              <div className={styles.details}>
                <div className={styles.detail}>
                  <p className={styles.characteristicsName}>Genre</p>
                  <p>{fullInfoBook.genre}</p>
                </div>
                <div className={styles.detail}>
                  <p className={styles.characteristicsName}>Publish date</p>
                  <p>{fullInfoBook.publicationYear}</p>
                </div>
                <div className={styles.detail}>
                  <p className={styles.characteristicsName}>Publisher</p>
                  <p>{fullInfoBook.publisher.name}</p>
                </div>
              </div>
              <div className={styles.details}>
                <div className={styles.detail}>
                  <p className={styles.characteristicsName}>Pages</p>
                  <p>{fullInfoBook.pages}</p>
                </div>
                <div className={styles.detail}>
                  <p className={styles.characteristicsName}>Language</p>
                  <p>{fullInfoBook.language}</p>
                </div>
                <div className={styles.detail}>
                  <p className={styles.characteristicsName}>ISBN</p>
                  <p>{fullInfoBook.ISBN}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className={styles.buyContainer}>
          {bookAvailability.available ? (
            <div className={styles.availability}>
              <img
                src="/available.png"
                alt="available"
                style={{ height: "24px" }}
              />
              <h2>AVAILABLE</h2>
            </div>
          ) : (
            <div className={styles.availability}>
              <img
                src="/out_of_stock.png"
                alt="out of stock"
                style={{ height: "24px" }}
              />
              <h2>OUT OF STOCK</h2>
            </div>
          )}
          <h1 className={styles.characteristicsName}>${fullInfoBook.price}</h1>
          <div className={styles.actionButtons}>
            <AddToCartButton onClick={handleAddToCartClick} />
            <button
              className={styles.wishlistButton}
              onClick={handleLikeButtonClick}
            >
              add to wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetails;
