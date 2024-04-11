import styles from "./AddToCartButton.module.css";

interface CartButtonProps {
  onClick: () => void;
}

function AddToCartButton({ onClick }: CartButtonProps) {
  return (
    <button className={styles.cartButton} onClick={onClick}>
      add to cart
    </button>
  );
}

export default AddToCartButton;
