import { useModal } from "../../ModalContext";
import styles from "./ErrorModal.module.css";

function ErrorModal() {
  const { isErrorPopupOpen, toggleErrorPopup, errorPopupText } = useModal();

  return isErrorPopupOpen ? (
    <div className={styles.overlay} onClick={toggleErrorPopup}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <h2>{errorPopupText}</h2>
        <img
          src="/close.png"
          alt="close"
          onClick={toggleErrorPopup}
          className={styles.closeButton}
        />
      </div>
    </div>
  ) : null;
}

export default ErrorModal;
