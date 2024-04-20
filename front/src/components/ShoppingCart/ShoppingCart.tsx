import React, { useEffect, useState } from "react";
import styles from "./ShoppingCart.module.css";
import { useModal } from "../../ModalContext";
import { Link, useNavigate } from "react-router-dom";

interface CartItem {
  customerId: number;
  bookId: number;
  sequenceNumber: number;
  quantity: number;
  shortInfoBook: {
    id: number;
    title: string;
    imageUrl: string;
    authors: string;
    price: number;
    liked: boolean;
  };
}

function ShoppingCart() {
  const { isCartOpen, toggleCart } = useModal();
  const [cart, setCart] = useState<CartItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          throw new Error("User ID not found in localStorage");
        }
        const response = await fetch(
          `http://localhost:8080/cart?userId=${userId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch cart data");
        }
        const data = await response.json();
        setCart(data);
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };

    if (isCartOpen) {
      fetchCart();
    }
  }, [isCartOpen]);

  const handleQuantityChange = async (itemId: number, newQuantity: number) => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch("http://localhost:8080/cart", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookId: itemId,
          userId: parseInt(userId || "0"),
          quantity: newQuantity,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update item quantity");
      }
      const updatedCart = cart.map((item) =>
        item.bookId === itemId ? { ...item, quantity: newQuantity } : item
      );
      setCart(updatedCart);
    } catch (error) {
      console.error("Error updating item quantity:", error);
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch(
        `http://localhost:8080/cart?bookId=${itemId}&userId=${userId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete item from cart");
      }
      const updatedCart = cart.filter((item) => item.bookId !== itemId);
      setCart(updatedCart);
    } catch (error) {
      console.error("Error deleting item from cart:", error);
    }
  };

  const calculateTotal = () => {
    return cart.reduce(
      (total, item) => total + item.quantity * item.shortInfoBook.price,
      0
    );
  };

  const handleCreateOrder = () => {
    toggleCart();
    navigate("/order");
  };

  return isCartOpen ? (
    <div className={styles.overlay} onClick={toggleCart}>
      <div className={styles.cart} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={toggleCart}>
          <img src="/close.png" height={"20px"} alt="close" />
        </button>
        <h2>Shopping Cart</h2>
        <div className={styles.itemsContainer}>
          {cart.map((item) => (
            <div key={item.bookId} className={styles.item}>
              <div className={styles.cover}>
                <img
                  src={item.shortInfoBook.imageUrl}
                  alt={item.shortInfoBook.title}
                  className={styles.itemImage}
                  style={{ height: "120px" }}
                />
              </div>
              <div className={styles.infoContainer}>
                <div className={styles.title}>{item.shortInfoBook.title}</div>
                <div className={styles.author}>
                  {item.shortInfoBook.authors}
                </div>
                <div className={styles.quantityContainer}>
                  <button
                    onClick={() =>
                      handleQuantityChange(item.bookId, item.quantity - 1)
                    }
                    className={styles.decreaseQuantityButton}
                    disabled={item.quantity === 1}
                  >
                    -
                  </button>
                  <div>{item.quantity}</div>
                  <button
                    onClick={() =>
                      handleQuantityChange(item.bookId, item.quantity + 1)
                    }
                    className={styles.increaseQuantityButton}
                  >
                    +
                  </button>
                </div>
                <div className={styles.price}>
                  Price: ${item.shortInfoBook.price}
                </div>
                <button
                  onClick={() => handleDeleteItem(item.bookId)}
                  className={styles.deleteItemButton}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.total}>
          <h3>Total: ${calculateTotal()}</h3>
        </div>
        <button
          className={styles.createOrderButton}
          onClick={handleCreateOrder}
        >
          Checkout
        </button>
      </div>
    </div>
  ) : null;
}

export default ShoppingCart;
