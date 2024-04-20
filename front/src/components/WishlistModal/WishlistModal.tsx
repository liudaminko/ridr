import React, { useState } from "react";
import styles from "./WishlistModal.module.css";

interface WishlistModalProps {
  wishlists: WishlistProps[]; // Define the shape of the wishlists prop
  onClose: () => void; // Define the type for onClose callback
  onAddToWishlist: (wishlistId: number) => void; // Define the type for onAddToWishlist callback
}

interface WishlistProps {
  id: number;
  name: string;
  customer_id: number;
  last_modified_at: string;
}

function WishlistModal({
  wishlists,
  onClose,
  onAddToWishlist,
}: WishlistModalProps) {
  const [selectedWishlist, setSelectedWishlist] = useState("");

  const handleWishlistChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedWishlist(event.target.value);
  };

  const handleSubmit = () => {
    onAddToWishlist(Number(selectedWishlist));
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h1>Add to Wishlist</h1>
        <select
          value={selectedWishlist}
          onChange={handleWishlistChange}
          className={styles.select}
          onClick={(e) => e.stopPropagation()}
        >
          <option value="">Select Wishlist</option>
          {wishlists.map((wishlist) => (
            <option key={wishlist.id} value={wishlist.id}>
              {wishlist.name}
            </option>
          ))}
        </select>
        <div className={styles.buttons}>
          <button onClick={handleSubmit} className={styles.okButton}>
            Add to Wishlist
          </button>
          <button onClick={onClose} className={styles.cancelButton}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default WishlistModal;
