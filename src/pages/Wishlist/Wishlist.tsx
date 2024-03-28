import { useState } from "react";
import styles from "./Wishlist.module.css";
import Book from "../../components/Book/Book";

interface WishlistProps {
  id: number;
  name: string;
}

function Wishlist() {
  const [newListModalVisibility, setNewListModalVisibility] = useState(false);
  const [modalVisibility, setModalVisibility] = useState(false);
  const [selectedWishlist, setSelectedWishlist] =
    useState<WishlistProps | null>(null);
  const [modalPosition, setModalPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });

  const [wishlists, setWishlists] = useState({
    user_id: 1,
    wishlists: [
      {
        id: 8,
        name: "books to read",
        last_modified_at: "2024-03-27T08:00:00Z",
      },
      {
        id: 3,
        name: "classics",
        last_modified_at: "2024-03-26T15:45:00Z",
      },
      {
        id: 2,
        name: "Fantasy )",
        last_modified_at: "2024-03-25T10:30:00Z",
      },
    ],
  });

  const [wishlist, setWishlist] = useState({
    wishlist_books: [
      {
        book_id: 7,
        title: "Moby-Dick",
        authors: "Herman Melville",
        price: 11.49,
        image_url: "https://example.com/moby_dick.jpg",
        liked: true,
      },
      {
        book_id: 8,
        title: "The Catcher in the Rye",
        authors: "J.D. Salinger",
        price: 9.99,
        image_url: "https://example.com/the_catcher_in_the_rye.jpg",
        liked: true,
      },
      {
        book_id: 9,
        title: "The Picture of Dorian Gray",
        authors: "Oscar Wilde",
        price: 10.79,
        image_url: "https://example.com/picture_of_dorian_gray.jpg",
        liked: true,
      },
      {
        book_id: 10,
        title: "Jane Eyre",
        authors: "Charlotte Bronte",
        price: 8.99,
        image_url: "https://example.com/jane_eyre.jpg",
        liked: true,
      },
      {
        book_id: 11,
        title: "Wuthering Heights",
        authors: "Emily Bronte",
        price: 9.49,
        image_url: "https://example.com/wuthering_heights.jpg",
        liked: true,
      },
      {
        book_id: 12,
        title: "Crime and Punishment",
        authors: "Fyodor Dostoevsky",
        price: 12.99,
        image_url: "https://example.com/crime_and_punishment.jpg",
        liked: true,
      },
      {
        book_id: 13,
        title: "Anna Karenina",
        authors: "Leo Tolstoy",
        price: 13.49,
        image_url: "https://example.com/anna_karenina.jpg",
        liked: true,
      },
      {
        book_id: 14,
        title: "Dracula",
        authors: "Bram Stoker",
        price: 10.99,
        image_url: "https://example.com/dracula.jpg",
        liked: true,
      },
      {
        book_id: 15,
        title: "The Odyssey",
        authors: "Homer",
        price: 11.29,
        image_url: "https://example.com/the_odyssey.jpg",
        liked: true,
      },
      {
        book_id: 16,
        title: "The Count of Monte Cristo",
        authors: "Alexandre Dumas",
        price: 14.99,
        image_url: "https://example.com/count_of_monte_cristo.jpg",
        liked: true,
      },
    ],
  });

  const toggleModalVisibility = (
    wishlist: WishlistProps,
    position: { top: number; left: number }
  ) => {
    setSelectedWishlist(wishlist);
    setModalVisibility(!modalVisibility);
    setModalPosition(position);
    console.log(position.left, position.top);
  };
  const toggleCreateListModalVisibility = () => {
    setNewListModalVisibility(!newListModalVisibility);
  };

  const handleDeleteWishlist = (wishlistId: number) => {
    console.log("Deleting wishlist with ID:", wishlistId);
  };

  const handleChangeTitle = (wishlistId: number, newTitle: string) => {
    console.log(
      "Changing title of wishlist with ID:",
      wishlistId,
      "to:",
      newTitle
    );
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Wishlists</h1>
      <div className={styles.wrapper}>
        <div className={styles.wishlistsContainer}>
          <button
            className={styles.createWishlist}
            onClick={() => toggleCreateListModalVisibility()}
          >
            + Create new list
          </button>
          {wishlists.wishlists.map((wishlist, index) => (
            <div className={styles.wishlist} key={wishlist.id}>
              <p>{wishlist.name}</p>
              <button
                className={styles.optionsButton}
                onClick={(e) =>
                  toggleModalVisibility(wishlist, {
                    top: e.clientY,
                    left: e.clientX + 16,
                  })
                }
              >
                <img src="/more.png" height={"16px"} alt="more" />
              </button>
            </div>
          ))}
          {modalVisibility && (
            <div
              className={styles.modal}
              style={{ top: modalPosition.top, left: modalPosition.left }}
            >
              <button
                onClick={() =>
                  handleChangeTitle(selectedWishlist?.id ?? 0, "New Title")
                }
                className={styles.modalOption}
              >
                Change Title
              </button>
              <button
                onClick={() => handleDeleteWishlist(selectedWishlist?.id ?? 0)}
                className={styles.modalOption}
              >
                Delete
              </button>
            </div>
          )}
        </div>
        <div className={styles.wishlistContent}>
          <h2 className={styles.wishlistName}>{selectedWishlist?.name}</h2>
          <div className={styles.wishlistBooks}>
            {wishlist.wishlist_books.map((book) => (
              <Book
                key={book.book_id}
                id={book.book_id}
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
        {newListModalVisibility && (
          <div
            className={styles.modalBackground}
            onClick={() => toggleCreateListModalVisibility()}
          >
            <div
              className={styles.newListModalContainer}
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Create new wishlist</h2>
              <input
                type="text"
                placeholder="wishlist name"
                className={styles.inputBox}
              />
              <div className={styles.buttons}>
                <button
                  className={styles.saveButton}
                  onClick={() => toggleCreateListModalVisibility()}
                >
                  save
                </button>
                <button
                  className={styles.cancelButton}
                  onClick={() => toggleCreateListModalVisibility()}
                >
                  cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;
