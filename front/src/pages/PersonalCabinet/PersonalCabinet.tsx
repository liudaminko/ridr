import { useState } from "react";
import styles from "./PersonalCabinet.module.css";
import DatePicker from "react-datepicker";

function PersonalCabinet() {
  const [userId, setUserId] = useState<string | null>(
    localStorage.getItem("userId")
  );

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [gender, setGender] = useState("");

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [genderError, setGenderError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={styles.container}>
      <h1>Personal cabinet</h1>
      <div className={styles.infoContainer}>
        <h2>Your personal data</h2>
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
          <div className={styles.fullName}>
            <div className={styles.inputContainer}>
              <p className={styles.inputName}>Birth Date</p>
              <DatePicker
                selected={birthDate}
                onChange={(date) => setBirthDate(date)}
                className={styles.inputBox}
                placeholderText="Select birth date"
                dateFormat="MM/dd/yyyy"
              />
              <label className={styles.errorLabel}>{emailError}</label>
            </div>
            <div className={styles.inputContainer}>
              <p className={styles.inputName}>Gender</p>
              <select
                value={gender}
                onChange={(ev) => setGender(ev.target.value)}
                className={styles.inputBox}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <label className={styles.errorLabel}>{genderError}</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PersonalCabinet;
