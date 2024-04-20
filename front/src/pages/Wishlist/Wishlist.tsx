import { useEffect, useState } from "react";
import styles from "./Wishlist.module.css";
import Book from "../../components/Book/Book";

interface WishlistProps {
  id: number;
  name: string;
  customer_id: number;
  last_modified_at: string;
}

interface BookProps {
  book_id: number;
  title: string;
  authors: string;
  price: number;
  imageUrl: string;
  liked: boolean;
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
  const [wishlists, setWishlists] = useState<WishlistProps[]>([]);
  const [recentWishlist, setRecentWishlist] = useState<WishlistProps | null>(
    null
  );
  const [wishlistBooks, setWishlistBooks] = useState<BookProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newWishlistName, setNewWishlistName] = useState("");

  const [userId, setUserId] = useState<string | null>(
    localStorage.getItem("userId")
  );

  useEffect(() => {
    const fetchWishlists = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://localhost:8080/wishlist/all?userId=${userId}`
        );
        if (response.ok) {
          const data = await response.json();
          setWishlists(data);
        } else {
          setError("Failed to fetch wishlists");
        }
      } catch (error) {
        setError("Error fetching wishlists");
      } finally {
        setLoading(false);
      }
    };

    const fetchRecentWishlist = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://localhost:8080/wishlist/recent?userId=${userId}`
        );
        if (response.ok) {
          const data = await response.json();
          setRecentWishlist(data);
          setSelectedWishlist(data);
        } else {
          setError("Failed to fetch recent wishlist");
        }
      } catch (error) {
        setError("Error fetching recent wishlist");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlists();
    fetchRecentWishlist();
  }, [userId]);

  useEffect(() => {
    const fetchWishlistBooks = async () => {
      if (recentWishlist) {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(
            `http://localhost:8080/wishlist?userId=${userId}&wishlistId=${recentWishlist.id}`
          );
          if (response.ok) {
            const data = await response.json();
            setWishlistBooks(data.books);
          } else {
            setError("Failed to fetch wishlist books");
          }
        } catch (error) {
          setError("Error fetching wishlist books");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchWishlistBooks();
  }, [recentWishlist, userId]);

  const toggleModalVisibility = (
    wishlist: WishlistProps,
    position: { top: number; left: number }
  ) => {
    setSelectedWishlist(wishlist);
    setModalVisibility(!modalVisibility);
    setModalPosition(position);
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

  const handleWishlistClick = async (wishlistId: number) => {
    try {
      const response = await fetch(
        `http://localhost:8080/wishlist?userId=${userId}&wishlistId=${wishlistId}`
      );
      if (response.ok) {
        const data = await response.json();
        setSelectedWishlist(data.wishlist);
        setWishlistBooks(data.books);
      } else {
        setError("Failed to fetch wishlist details");
      }
    } catch (error) {
      setError("Error fetching wishlist details");
    }
  };

  const handleCreateNewWishlist = async () => {
    if (!newWishlistName.trim()) {
      setError("Wishlist name cannot be empty");
      return;
    }
    try {
      const response = await fetch("http://localhost:8080/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newWishlistName.trim(),
          userId: parseInt(userId || "0"),
        }),
      });
      if (response.ok) {
        toggleCreateListModalVisibility();
        setNewWishlistName("");
        const updatedResponse = await fetch(
          `http://localhost:8080/wishlist/all?userId=${userId}`
        );
        if (updatedResponse.ok) {
          const data = await updatedResponse.json();
          setWishlists(data);
        } else {
          setError("Failed to fetch updated wishlists");
        }
      } else {
        setError("Failed to create new wishlist");
      }
    } catch (error) {
      setError("Error creating new wishlist");
    }
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
          {loading && <p>Loading...</p>}
          {error && <p>{error}</p>}
          {wishlists.map((wishlist, index) => (
            <div
              className={styles.wishlist}
              key={wishlist.id}
              onClick={() => handleWishlistClick(wishlist.id)}
            >
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
          <h2 className={styles.wishlistName}>
            {selectedWishlist ? selectedWishlist.name : "     "}
          </h2>
          <div className={styles.wishlistBooks}>
            {wishlistBooks.map((book, index) => (
              <Book
                key={index}
                id={book.book_id}
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
                value={newWishlistName}
                onChange={(e) => setNewWishlistName(e.target.value)}
              />
              <div className={styles.buttons}>
                <button
                  className={styles.saveButton}
                  onClick={handleCreateNewWishlist}
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
