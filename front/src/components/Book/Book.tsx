import { Link, useNavigate } from "react-router-dom";
import styles from "./Book.module.css";
import { useEffect, useState } from "react";
import { useModal } from "../../ModalContext";
import WishlistModal from "../WishlistModal/WishlistModal";

interface BookProps {
  id: number;
  imageUrl: string;
  authors: string;
  title: string;
  price: number;
  liked: boolean;
  width: string;
}
interface WishlistProps {
  id: number;
  name: string;
  customer_id: number;
  last_modified_at: string;
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
  const [userId, setUserId] = useState<string | null>(
    localStorage.getItem("userId")
  );

  const navigate = useNavigate();

  const [cartStatus, setCartStatus] = useState<string | null>(null);
  const { toggleCart } = useModal();
  const [modalVisibility, setModalVisibility] = useState(false);
  const [wishlists, setWishlists] = useState<WishlistProps[]>([]);

  const handleLikeClick = (event: React.MouseEvent<HTMLImageElement>) => {
    event.stopPropagation();
    event.preventDefault();
    setModalVisibility(!modalVisibility);
  };

  const handleAddToCart = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();

    try {
      const response = await fetch("http://localhost:8080/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookId: id,
          userId: parseInt(userId || "0"),
        }),
      });
      if (response.ok) {
        setCartStatus("Book added to cart successfully.");
        toggleCart();
      } else {
        setCartStatus("Failed to add book to cart.");
      }
    } catch (error) {
      console.error("Error adding book to cart:", error);
      setCartStatus("Error adding book to cart.");
    }
  };

  const handleContainerClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();

    if (
      !event.target ||
      !(event.target as HTMLElement).classList.contains(styles.buttons)
    ) {
      navigate(`/book/${id}`);
    }
  };

  useEffect(() => {
    const fetchWishlists = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/wishlist/all?userId=${userId}`
        );
        if (response.ok) {
          const data = await response.json();
          setWishlists(data);
        } else {
          console.log("Failed to fetch wishlists");
        }
      } catch (error) {
        console.log("Error fetching wishlists");
      }
    };
    fetchWishlists();
  }, [userId]);

  const handleAddToWishlist = async (wishlistId: number) => {
    try {
      const response = await fetch("http://localhost:8080/wishlist/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wishlistId: wishlistId,
          bookId: id,
          userId: parseInt(userId || "0"),
        }),
      });
      if (response.ok) {
        console.log("Book added to wishlist successfully");
        setModalVisibility(!modalVisibility);
      } else {
        console.error("Failed to add book to wishlist");
      }
    } catch (error) {
      console.error("Error adding book to wishlist:", error);
    }
  };

  const closeModal = () => {
    setModalVisibility(!modalVisibility);
  };

  return (
    <div
      className={styles.container}
      onClick={handleContainerClick}
      style={{ width }}
    >
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
        <div className={styles.buttons}>
          <button onClick={handleAddToCart} className={styles.addToCartButton}>
            add to cart
          </button>
        </div>
      </div>
      {modalVisibility && (
        <WishlistModal
          wishlists={wishlists}
          onClose={closeModal}
          onAddToWishlist={handleAddToWishlist}
        />
      )}
    </div>
  );
}

export default Book;
