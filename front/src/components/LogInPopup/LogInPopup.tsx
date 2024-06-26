import styles from "./LogInPopup.module.css";
import { useModal } from "../../ModalContext";
import { useState } from "react";

function LogInPopup() {
  const { isLogInOpen, toggleLogInPopup, toggleSignUpPopup } = useModal();
  const [logInMethod, setLogInMethod] = useState("phone");
  const [showPassword, setShowPassword] = useState(false);
  const [userId, setUserId] = useState<string | null>(
    localStorage.getItem("userId")
  );

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmitClick = async () => {
    console.log("LOG IN");
    setPhoneError("");
    setEmailError("");
    setPasswordError("");

    if (logInMethod == "phone" && "" === phone) {
      setPhoneError("Please enter your phone");
      return;
    }
    if (logInMethod == "phone" && !/^\+?\d{10,}$/.test(phone)) {
      setPhoneError("Please enter a valid phone number (start with '+' sign)");
      return;
    }

    if (logInMethod == "email" && "" === email) {
      setEmailError("Please enter your email");
      return;
    }

    if (
      logInMethod == "email" &&
      !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)
    ) {
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

    try {
      console.log("http://localhost:8080/user/login/", logInMethod);
      const response = await fetch(
        `http://localhost:8080/user/login/${logInMethod}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: logInMethod === "email" ? email : "",
            phoneNumber: logInMethod === "phone" ? phone : "",
            password,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("userId", data);
        setUserId(data);
        toggleLogInPopup();
        console.log("Login successful:", data); // Log success response
      } else {
        const errorData = await response.json(); // Log error response
        console.error("Login failed:", errorData);
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const handlePhoneLogInClick = () => {
    setLogInMethod("phone");
  };
  const handleEmailLogInClick = () => {
    setLogInMethod("email");
  };
  const togglePopups = () => {
    toggleLogInPopup();
    toggleSignUpPopup();
  };

  const isButtonDisabled = () => {
    if (logInMethod === "phone") {
      return !phone || !password;
    } else {
      return !email || !password;
    }
  };

  return isLogInOpen ? (
    <div className={styles.overlay} onClick={toggleLogInPopup}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <h1>Log In</h1>
        <img
          src="/close.png"
          alt="close"
          onClick={toggleLogInPopup}
          className={styles.closeButton}
        />
        <div className={styles.form}>
          <div className={styles.logInMethodChoose}>
            <h3>Log in with:</h3>
            <div className={styles.logInMethodButtons}>
              <button
                className={
                  logInMethod === "phone"
                    ? `${styles.methodButton} ${styles.active}`
                    : styles.methodButton
                }
                onClick={handlePhoneLogInClick}
              >
                Phone number
              </button>
              <button
                className={
                  logInMethod === "email"
                    ? `${styles.methodButton} ${styles.active}`
                    : styles.methodButton
                }
                onClick={handleEmailLogInClick}
              >
                Email
              </button>
            </div>
          </div>

          {logInMethod === "phone" ? (
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
          ) : (
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
          )}

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
          log in
        </button>
        <div className={styles.signUpContainer}>
          <p>Don't have an account?</p>
          <p className={styles.signUp} onClick={togglePopups}>
            Create one
          </p>
        </div>
      </div>
    </div>
  ) : null;
}

export default LogInPopup;
