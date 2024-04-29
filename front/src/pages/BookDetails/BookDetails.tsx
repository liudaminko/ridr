import styles from "./BookDetails.module.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import AddToCartButton from "../../components/AddToCartButton/AddToCartButton";

interface Author {
  id: number;
  name: string;
}

interface Genre {
  id: number;
  name: string;
}

interface Publisher {
  id: number;
  name: string;
}

interface BookDetails {
  id: number;
  imageUrl: string;
  title: string;
  authors: Author[];
  description: string;
  price: number;
  genre: Genre;
  pages: number;
  publicationYear: number;
  publisher: Publisher;
  ISBN: number;
  language: string;
}

function BookDetails() {
  const { id } = useParams<{ id: string }>();
  const [isFullDescription, setFullDescription] = useState(false);
  const [isBookDetailsOpened, setBookDetailsOpen] = useState(false);
  const [bookDetails, setBookDetails] = useState<BookDetails | null>(null);

  useEffect(() => {
    console.log("requesting...");
    const fetchBookDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/book/fullinfo?bookId=${id}`
        );
        console.log(id);
        if (response.ok) {
          const data = await response.json();
          const parsedData = {
            ...data,
            authors: JSON.parse(data.authors),
            genre: JSON.parse(data.genre),
            publisher: JSON.parse(data.publisher),
          };
          setBookDetails(parsedData);
        } else {
          console.error("Failed to fetch book details:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    };

    fetchBookDetails();
  }, [id]);

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
    console.log("added to cart:", bookDetails?.id);
  };

  const handleLikeButtonClick = () => {
    console.log("liked:", bookDetails?.id);
  };

  return (
    <div className={styles.container}>
      <div className={styles.cover}>
        <div className={styles.tags}></div>
        <img
          src={bookDetails?.imageUrl}
          alt="cover"
          className={styles.coverImage}
        />
      </div>
      <div className={styles.infoContainer}>
        <h3 className={styles.bookPath}>
          All books / Fiction / Classics / {bookDetails?.title}
        </h3>
        <div className={styles.mainInfo}>
          <h1 className={styles.title}>{bookDetails?.title}</h1>
          {bookDetails?.authors.map((author, index) => (
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
            {bookDetails?.description}
          </p>
          {bookDetails?.description && bookDetails.description.length > 200 && (
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
                  <p>{bookDetails?.genre.name}</p>
                </div>
                <div className={styles.detail}>
                  <p className={styles.characteristicsName}>Publish date</p>
                  <p>{bookDetails?.publicationYear}</p>
                </div>
                <div className={styles.detail}>
                  <p className={styles.characteristicsName}>Publisher</p>
                  <p>{bookDetails?.publisher.name}</p>
                </div>
              </div>
              <div className={styles.details}>
                <div className={styles.detail}>
                  <p className={styles.characteristicsName}>Pages</p>
                  <p>{bookDetails?.pages}</p>
                </div>
                <div className={styles.detail}>
                  <p className={styles.characteristicsName}>Language</p>
                  <p>{bookDetails?.language}</p>
                </div>
                <div className={styles.detail}>
                  <p className={styles.characteristicsName}>ISBN</p>
                  <p>{bookDetails?.ISBN}</p>
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
          <h1 className={styles.characteristicsName}>${bookDetails?.price}</h1>
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
