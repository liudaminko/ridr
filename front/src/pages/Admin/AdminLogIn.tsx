import { useState } from "react";
import styles from "./AdminLogIn.module.css";

interface AdminLogInProps {
  onLogin: () => void;
}

const AdminLogIn = ({ onLogin }: AdminLogInProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleLogin = async () => {
    setEmailError("");
    setPasswordError("");

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

    try {
      const response = await fetch("http://localhost:8080/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem("token", token);
        onLogin();
      } else {
        setError("Invalid username or password");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setError("An error occurred while logging in");
    }
  };

  const isButtonDisabled = () => {
    return !email || !password;
  };

  return (
    <div className={styles.container}>
      <h2>Login</h2>
      <div className={styles.form}>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.inputBox}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.inputBox}
        />
      </div>

      <button
        onClick={handleLogin}
        className={styles.submitButton}
        disabled={isButtonDisabled()}
      >
        Login
      </button>
      {error && <p>{error}</p>}
    </div>
  );
};

export default AdminLogIn;
