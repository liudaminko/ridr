import styles from "./ShoppingCart.module.css";

interface ShoppingCartProps {
  onClose: () => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ onClose }) => {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.cart}>
        <button className={styles.closeButton} onClick={onClose}>
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
  );
};

export default ShoppingCart;
