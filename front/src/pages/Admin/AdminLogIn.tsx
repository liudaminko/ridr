import { useState } from "react";
import styles from "./AdminLogIn.module.css";

interface AdminLogInProps {
  onLogin: () => void;
}

const AdminLogIn = ({ onLogin }: AdminLogInProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
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

      <button onClick={handleLogin} className={styles.submitButton}>
        Login
      </button>
      {error && <p>{error}</p>}
    </div>
  );
};

export default AdminLogIn;
