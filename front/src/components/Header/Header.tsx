import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import SearchBar from "../SearchBar/SearchBar";
import { useModal } from "../../ModalContext";
import { useEffect, useState } from "react";
import DropdownMenu from "../DropdownMenu/DropdownMenu";
import { useNavigate } from "react-router-dom";

function Header() {
  const { toggleCart, toggleLogInPopup, toggleSignUpPopup } = useModal();
  const [userId, setUserId] = useState<string | null>(
    localStorage.getItem("userId")
  );
  const [showDropdown, setShowDropdown] = useState(false);

  const options = ["Settings", "Orders", "Log Out"];
  const optionsUrls = ["/settings.png", "/order.png", ""];

  const navigation = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, [userId, localStorage]);
  const [cartItemsCount, setCartItemsCount] = useState(0);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (userId) {
        try {
          const response = await fetch(
            `http://localhost:8080/cart?userId=${userId}`
          );
          if (response.ok) {
            const data = await response.json();
            setCartItemsCount(data.length);
          } else {
            throw new Error("Failed to fetch cart items");
          }
        } catch (error) {
          console.error("Error fetching cart items:", error);
        }
      }
    };

    fetchCartItems();
  }, [userId]);

  const handleOptionClick = (option: string) => {
    setShowDropdown(!showDropdown);
    if (option === "Settings") {
      navigation("/cabinet");
    } else if (option === "Orders") {
      navigation("/orders");
    } else {
      localStorage.removeItem("userId");
      setUserId(null);
    }
  };

  return (
    <div className={styles.container}>
      <Link to="/">
        <img src="/logo2.svg" style={{ height: "2rem" }} alt="logo" />
      </Link>
      <SearchBar />
      <div className={styles.phoneCompound}>
        <div className={styles.phone}>
          <img src="/phone.png" style={{ height: "16px" }} alt="contacts" />
          <p className={styles.phoneNumber}>+380-93-567-20-00</p>
        </div>
        <p className={styles.schedule}>without weekends, 9 a.m. - 8 p.m.</p>
      </div>
      <div className={styles.userCompound}>
        {userId && (
          <div className={styles.compound}>
            <Link to="/wishlist">
              <img src="/like.png" style={{ height: "24px" }} alt="wishlist" />
            </Link>
            <div className={styles.cartContainer} onClick={toggleCart}>
              <img
                src="/shopping-cart.png"
                style={{ height: "24px", cursor: "pointer" }}
                alt="cart"
              />
              {cartItemsCount > 0 && (
                <div className={styles.cartCount}>{cartItemsCount}</div>
              )}
            </div>
          </div>
        )}

        {userId ? (
          <img
            src="/user.png"
            style={{ height: "32px", cursor: "pointer" }}
            alt="user"
            onClick={() => setShowDropdown(!showDropdown)}
          />
        ) : (
          <div className={styles.compound}>
            <button className={styles.logInButton} onClick={toggleLogInPopup}>
              log in
            </button>
            <button className={styles.signUpButton} onClick={toggleSignUpPopup}>
              sign up
            </button>
          </div>
        )}
        {showDropdown && (
          <DropdownMenu
            options={options}
            onOptionClick={handleOptionClick}
            optionImages={optionsUrls}
          />
        )}
      </div>
    </div>
  );
}

export default Header;
