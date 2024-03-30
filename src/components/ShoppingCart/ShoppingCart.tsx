import styles from "./ShoppingCart.module.css";
import { useModal } from "../../ModalContext";
import { useState } from "react";

function ShoppingCart() {
  const { isCartOpen, toggleCart } = useModal();

  const [cart, setCart] = useState({
    userId: 1,
    cart: [
      {
        id: 1,
        image: "/9780060935467.jpeg",
        title: "1984",
        authors: ["George Orwell"],
        quantity: 1,
        price: 12,
        bookSequence: 1,
      },
      {
        id: 2,
        image: "/9780140434262.jpeg",
        title: "To Kill a Mockingbird",
        authors: ["Harper Lee", "lets imagine"],
        quantity: 1,
        price: 9,
        bookSequence: 2,
      },
      {
        id: 3,
        image: "/9780060935467.jpeg",
        title: "1984",
        authors: ["George Orwell"],
        quantity: 1,
        price: 12,
        bookSequence: 1,
      },
      {
        id: 4,
        image: "/9780140434262.jpeg",
        title: "To Kill a Mockingbird",
        authors: ["Harper Lee", "lets imagine"],
        quantity: 1,
        price: 9,
        bookSequence: 2,
      },
    ],
  });

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    const updatedCart = cart.cart.map((item) => {
      if (item.id === itemId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });

    setCart({ ...cart, cart: updatedCart });
  };

  const handleDeleteItem = (itemId: number) => {
    const updatedCart = cart.cart.filter((item) => item.id !== itemId);

    setCart({ ...cart, cart: updatedCart });
  };

  const calculateTotal = () => {
    return cart.cart.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );
  };

  return isCartOpen ? (
    <div className={styles.overlay} onClick={toggleCart}>
      <div className={styles.cart} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={toggleCart}>
          <img src="/close.png" height={"20px"} alt="close" />
        </button>
        <h2>Shopping Cart</h2>
        <div className={styles.itemsContainer}>
          {cart.cart.map((item) => (
            <div key={item.id} className={styles.item}>
              <div className={styles.cover}>
                <img
                  src={item.image}
                  alt={item.title}
                  className={styles.itemImage}
                  style={{ height: "120px" }}
                />
              </div>
              <div className={styles.infoContainer}>
                <div className={styles.title}>{item.title}</div>
                {item.authors.map((author, index) => (
                  <div key={index} className={styles.author}>
                    {author}
                  </div>
                ))}
                <div className={styles.quantityContainer}>
                  <button
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity - 1)
                    }
                    className={styles.decreaseQuantityButton}
                    disabled={item.quantity === 1}
                  >
                    -
                  </button>
                  <div>{item.quantity}</div>
                  <button
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity + 1)
                    }
                    className={styles.increaseQuantityButton}
                  >
                    +
                  </button>
                </div>
                <div className={styles.price}>Price: ${item.price}</div>
                <button
                  onClick={() => handleDeleteItem(item.id)}
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
        <button className={styles.createOrderButton}>Checkout</button>
      </div>
    </div>
  ) : null;
}

export default ShoppingCart;
