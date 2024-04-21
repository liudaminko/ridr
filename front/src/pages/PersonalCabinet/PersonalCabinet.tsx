import { useState, useEffect } from "react";
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
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [gender, setGender] = useState("");

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [oldPasswordError, setOldPasswordError] = useState("");
  const [genderError, setGenderError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [isFormChanged, setIsFormChanged] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/user/info?userId=${userId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const userData = await response.json();
        setFirstName(userData.firstName);
        setLastName(userData.lastName);
        setPhone(userData.phoneNumber);
        setEmail(userData.email);
        setBirthDate(userData.birthDate ? new Date(userData.birthDate) : null);
        setGender(userData.gender);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserInfo();
  }, [userId]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setIsFormChanged(true);

    switch (name) {
      case "firstName":
        setFirstName(value);
        break;
      case "lastName":
        setLastName(value);
        break;
      case "phone":
        setPhone(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "newPassword":
        setNewPassword(value);
        break;
      case "oldPassword":
        setOldPassword(value);
        break;
      case "gender":
        setGender(value);
        break;
      default:
        break;
    }
  };

  const checkOldPassword = async () => {
    try {
      const response = await fetch(`http://localhost:8080/user/password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          password: oldPassword,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to check old password");
      }
      return true;
    } catch (error) {
      console.error("Error checking old password:", error);
      return false;
    }
  };

  const handleSubmitClick = async () => {
    setFirstNameError("");
    setLastNameError("");
    setPhoneError("");
    setEmailError("");
    setNewPasswordError("");
    setOldPasswordError("");
    setGenderError("");

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
    if (!/^\+?\d{10,}$/.test(phone)) {
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

    if (isFormChanged && "" === oldPassword) {
      setOldPasswordError("Please enter your old password");
      return;
    }

    if (newPassword.length < 7 && newPassword !== "") {
      setNewPasswordError("The password must be 8 characters or longer");
      return;
    }

    const oldPasswordMatched = await checkOldPassword();
    if (!oldPasswordMatched) {
      setOldPasswordError("Incorrect old password");
      return;
    }

    const updatedUser = {
      firstName,
      lastName,
      phone,
      email,
      newPassword,
      oldPassword,
      birthDate,
      gender,
    };

    try {
      const response = await fetch(
        `http://localhost:8080/user?userId=${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUser),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUserId(data);
        localStorage.setItem("userId", data);
        setIsFormChanged(false);
      } else {
        // Handle error response
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const isButtonDisabled = () => {
    return (
      firstNameError !== "" ||
      lastNameError !== "" ||
      phoneError !== "" ||
      emailError !== "" ||
      oldPasswordError !== "" ||
      newPasswordError !== "" ||
      genderError !== "" ||
      !isFormChanged ||
      (!oldPassword && isFormChanged)
    );
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Personal cabinet</h1>
      <div className={styles.infoContainer}>
        <h2 className={styles.pageTitle}>Your personal data</h2>
        <div className={styles.form}>
          <div className={styles.fullName}>
            <div className={styles.inputContainer}>
              <h3 className={styles.inputName}>First name</h3>
              <input
                type="text"
                name="firstName"
                placeholder="Enter first name"
                value={firstName}
                onChange={handleInputChange}
                className={styles.inputBox}
              />
              <label className={styles.errorLabel}>{firstNameError}</label>
            </div>
            <div className={styles.inputContainer}>
              <h3 className={styles.inputName}>Last name</h3>
              <input
                type="text"
                name="lastName"
                placeholder="Enter last name"
                value={lastName}
                onChange={handleInputChange}
                className={styles.inputBox}
              />
              <label className={styles.errorLabel}>{lastNameError}</label>
            </div>
          </div>

          <div className={styles.inputContainer}>
            <h3 className={styles.inputName}>Phone number</h3>
            <input
              type="text"
              name="phone"
              placeholder="Enter phone number"
              value={phone}
              onChange={handleInputChange}
              className={styles.inputBox}
            />
            <label className={styles.errorLabel}>{phoneError}</label>
          </div>
          <div className={styles.inputContainer}>
            <h3 className={styles.inputName}>Email</h3>
            <input
              type="text"
              name="email"
              placeholder="Enter email"
              value={email}
              onChange={handleInputChange}
              className={styles.inputBox}
            />
            <label className={styles.errorLabel}>{emailError}</label>
          </div>

          <div className={styles.fullName}>
            <div className={styles.inputContainer}>
              <h3 className={styles.inputName}>Old password</h3>
              <div className={styles.passwordContainer}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="oldPassword"
                  placeholder="Enter old password"
                  value={oldPassword}
                  onChange={handleInputChange}
                  className={styles.inputBox}
                />
                <img
                  src={showPassword ? "/visible.png" : "/hidden.png"}
                  className={styles.showPassword}
                  onClick={() => setShowPassword(!showPassword)}
                  alt="password visibility"
                />
              </div>
              <label className={styles.errorLabel}>{oldPasswordError}</label>
            </div>
            <div className={styles.inputContainer}>
              <h3 className={styles.inputName}>New password</h3>
              <div className={styles.passwordContainer}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={handleInputChange}
                  className={styles.inputBox}
                />
                <img
                  src={showPassword ? "/visible.png" : "/hidden.png"}
                  className={styles.showPassword}
                  onClick={() => setShowPassword(!showPassword)}
                  alt="password visibility"
                />
              </div>
              <label className={styles.errorLabel}>{newPasswordError}</label>
            </div>
          </div>

          <div className={styles.fullName}>
            <div className={styles.inputContainer}>
              <h3 className={styles.inputName}>Birth Date</h3>
              <DatePicker
                selected={birthDate}
                onChange={(date) => setBirthDate(date)}
                className={styles.inputBox}
                placeholderText="Select birth date"
                dateFormat="MM/dd/yyyy"
              />
            </div>
            <div className={styles.inputContainer}>
              <p className={styles.inputName}>Gender</p>
              <select
                name="gender"
                value={gender}
                onChange={handleInputChange}
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
      <button
        className={`${styles.submitButton} ${
          isButtonDisabled() ? styles.disabled : ""
        }`}
        onClick={handleSubmitClick}
        disabled={isButtonDisabled()}
      >
        Save Changes
      </button>
    </div>
  );
}

export default PersonalCabinet;
