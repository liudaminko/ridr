import styles from "./ShoppingCart.module.css";
import { useModal } from "../../ModalContext";

function ShoppingCart() {
  const { isCartOpen, toggleCart } = useModal();
  return isCartOpen ? (
    <div className={styles.overlay} onClick={toggleCart}>
      <div className={styles.cart}>
        <button className={styles.closeButton} onClick={toggleCart}>
          Close
        </button>
        <h2>Shopping Cart</h2>
        <div className={styles.itemsContainer}></div>
        <div className={styles.total}>
          <h3>total: $</h3>
        </div>
        <div className={styles.buttons}>
          <button className={styles.clearCartButton}>empty cart</button>
          <button className={styles.createOrderButton}>checkout</button>
        </div>
      </div>
    </div>
  ) : null;
}

export default ShoppingCart;
