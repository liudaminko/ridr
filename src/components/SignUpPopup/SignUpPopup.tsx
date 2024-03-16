import styles from "./SignUp.module.css";
import { useModal } from "../../ModalContext";
import { useState } from "react";

function SignUpPopup() {
  const { isSignUpOpen, toggleSignUpPopup, toggleLogInPopup } = useModal();
  const [logInMethod, setLogInMethod] = useState("phone");
  const [showPassword, setShowPassword] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmitClick = () => {
    setFirstNameError("");
    setLastNameError("");
    setPhoneError("");
    setEmailError("");
    setPasswordError("");

    if ("" === firstName) {
      setFirstNameError("Please enter your first name");
      return;
    }
    if (!/^[a-zA-Z]{2,}$/.test(firstName)) {
      setFirstNameError("Please enter a valid first name");
      return;
    }

    if ("" === lastName) {
      setLastNameError("Please enter your last name");
      return;
    }
    if (!/^[a-zA-Z]{2,}$/.test(lastName)) {
      setLastNameError("Please enter a valid last name");
      return;
    }

    if ("" === phone) {
      setPhoneError("Please enter your phone");
      return;
    }
    if (!/^\+?\d{10}$/.test(phone)) {
      setPhoneError("Please enter a valid phone number (start with '+' sign)");
      return;
    }

    if ("" === email) {
      setEmailError("Please enter your email");
      return;
    }

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setEmailError("Please enter a valid email");
      return;
    }

    if ("" === password) {
      setPasswordError("Please enter a password");
      return;
    }

    if (password.length < 7) {
      setPasswordError("The password must be 8 characters or longer");
      return;
    }
  };

  const togglePopups = () => {
    toggleSignUpPopup();
    toggleLogInPopup();
  };

  const isButtonDisabled = () => {
    return !firstName || !lastName || !email || !phone || !password;
  };

  return isSignUpOpen ? (
    <div className={styles.overlay} onClick={toggleSignUpPopup}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <h1>Sign Up</h1>
        <img
          src="/close.png"
          alt="close"
          onClick={toggleSignUpPopup}
          className={styles.closeButton}
        />
        <div className={styles.form}>
          <div className={styles.fullName}>
            <div className={styles.inputContainer}>
              <p className={styles.inputName}>First name</p>
              <input
                type="text"
                placeholder="enter first name"
                value={firstName}
                onChange={(ev) => setFirstName(ev.target.value)}
                className={styles.inputBox}
              />
              <label className={styles.errorLabel}>{firstNameError}</label>
            </div>
            <div className={styles.inputContainer}>
              <p className={styles.inputName}>Last name</p>
              <input
                type="text"
                placeholder="enter last name"
                value={lastName}
                onChange={(ev) => setLastName(ev.target.value)}
                className={styles.inputBox}
              />
              <label className={styles.errorLabel}>{lastNameError}</label>
            </div>
          </div>

          <div className={styles.inputContainer}>
            <p className={styles.inputName}>Phone number</p>
            <input
              type="text"
              placeholder="enter phone number"
              value={phone}
              onChange={(ev) => setPhone(ev.target.value)}
              className={styles.inputBox}
            />
            <label className={styles.errorLabel}>{phoneError}</label>
          </div>
          <div className={styles.inputContainer}>
            <p className={styles.inputName}>Email</p>
            <input
              type="text"
              placeholder="enter email"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              className={styles.inputBox}
            />
            <label className={styles.errorLabel}>{emailError}</label>
          </div>

          <div className={styles.inputContainer}>
            <p className={styles.inputName}>Password</p>
            <div className={styles.passwordContainer}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="enter password"
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
                className={styles.inputBox}
              />
              <img
                src={showPassword ? "/visible.png" : "/hidden.png"}
                className={styles.showPassword}
                onClick={() => setShowPassword(!showPassword)}
                alt="password visibility"
              />
            </div>
            <label className={styles.errorLabel}>{passwordError}</label>
          </div>
        </div>
        <button
          className={`${styles.submitButton} ${
            isButtonDisabled() ? styles.disabled : ""
          }`}
          onClick={handleSubmitClick}
          disabled={isButtonDisabled()}
        >
          sign up
        </button>
        <div className={styles.signUpContainer}>
          <p>Already have an account?</p>
          <p className={styles.signUp} onClick={togglePopups}>
            Log in
          </p>
        </div>
      </div>
    </div>
  ) : null;
}

export default SignUpPopup;
