import styles from "./SignUp.module.css";
import { useModal } from "../../ModalContext";

function SignUpPopup() {
  const { isSignUpOpen, toggleSignUpPopup } = useModal();

  return isSignUpOpen ? (
    <div className={styles.overlay} onClick={toggleSignUpPopup}>
      <div className={styles.container}>
        <h1>Sign up</h1>
        <img src="close.png" alt="close" onClick={toggleSignUpPopup} />
      </div>
    </div>
  ) : null;
}

export default SignUpPopup;
