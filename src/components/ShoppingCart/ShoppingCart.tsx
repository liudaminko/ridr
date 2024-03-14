import styles from "./ShoppingCart.module.css";

function ShoppingCart() {
  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <h2>Cart</h2>
        <div className={styles.itemsContainer}></div>
      </div>
      <h2>total: </h2>
      <button className={styles.orderButton}>order</button>
    </div>
  );
}

export default ShoppingCart;
