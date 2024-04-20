import { useEffect, useState } from "react";
import styles from "./Order.module.css";
import { transliterate as tr, slugify } from "transliteration";

//declare const google: any;

interface CartItem {
  customerId: number;
  bookId: number;
  sequenceNumber: number;
  quantity: number;
  shortInfoBook: {
    id: number;
    title: string;
    imageUrl: string;
    authors: string;
    price: number;
    liked: boolean;
  };
}

interface DeliveryService {
  id: number;
  name: string;
}

interface DeliveryType {
  id: number;
  name: string;
  description: string;
}

interface User {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

function Order() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState<User>();
  const [deliveryServices, setDeliveryServices] = useState<DeliveryService[]>(
    []
  );
  const [deliveryTypes, setDeliveryTypes] = useState<DeliveryType[]>([]);

  const [userId, setUserId] = useState<string | null>(
    localStorage.getItem("userId")
  );
  const [isCartEditing, setIsCartEditing] = useState(false);

  const [isRecipientOtherPerson, setIsRecipientOtherPerson] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const [cityRegionInputValue, setCityRegionInputValue] = useState("");
  const [addressInputValue, setAddressInputValue] = useState("");

  const [cities, setCities] = useState<
    {
      Ref: string;
      DescriptionTranslit: string;
      AreaDescriptionTranslit: string;
    }[]
  >([]);

  const [addresses, setAddresses] = useState<
    {
      Ref: string;
      Description: string;
      Number: string;
    }[]
  >([]);

  const [selectedServiceProvider, setSelectedServiceProvider] = useState<
    number | null
  >(null);
  const [selectedDeliveryType, setSelectedDeliveryType] = useState<
    number | null
  >(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/cart?userId=${userId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch cart data");
        }
        const data = await response.json();
        setCart(data);
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };
    fetchCart();

    const fetchDeliveryServices = async () => {
      try {
        const response = await fetch("http://localhost:8080/deliveryservice");
        if (!response.ok) {
          throw new Error("Failed to fetch delivery services");
        }
        const data = await response.json();
        setDeliveryServices(data);
      } catch (error) {
        console.error("Error fetching delivery services:", error);
      }
    };
    fetchDeliveryServices();

    const fetchDeliveryTypes = async () => {
      try {
        const response = await fetch("http://localhost:8080/deliverytype");
        if (!response.ok) {
          throw new Error("Failed to fetch delivery types");
        }
        const data = await response.json();
        setDeliveryTypes(data);
      } catch (error) {
        console.error("Error fetching delivery types:", error);
      }
    };
    fetchDeliveryTypes();

    const fetchUserInfo = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/user/info?userId=${userId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        setCustomer(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserInfo();
  }, [userId]);

  const handleQuantityChange = async (itemId: number, newQuantity: number) => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch("http://localhost:8080/cart", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookId: itemId,
          userId: parseInt(userId || "0"),
          quantity: newQuantity,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update item quantity");
      }
      const updatedCart = cart.map((item) =>
        item.bookId === itemId ? { ...item, quantity: newQuantity } : item
      );
      setCart(updatedCart);
    } catch (error) {
      console.error("Error updating item quantity:", error);
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch(
        `http://localhost:8080/cart?bookId=${itemId}&userId=${userId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete item from cart");
      }
      const updatedCart = cart.filter((item) => item.bookId !== itemId);
      setCart(updatedCart);
    } catch (error) {
      console.error("Error deleting item from cart:", error);
    }
  };

  const calculateTotal = () => {
    return cart.reduce(
      (total, item) => total + item.quantity * item.shortInfoBook.price,
      0
    );
  };

  const handleRecipientSwitchChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsRecipientOtherPerson(event.target.checked);
  };

  const createDeliveryAddress = async () => {
    try {
      const [city, region] = selectedCityRegion.split(",");
      const response = await fetch("http://localhost:8080/deliveryaddress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          region: region.trim(),
          city: city.trim(),
          address: selectedAddress.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create delivery address");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error creating delivery address:", error);
      throw error;
    }
  };

  const createDelivery = async (deliveryAddressId: string) => {
    try {
      const finalRecipientName = isRecipientOtherPerson
        ? firstName + " " + lastName
        : customer?.firstName + " " + customer?.lastName;
      const finalRecipientPhone = isRecipientOtherPerson
        ? phone
        : customer?.phoneNumber;

      console.log(selectedDeliveryType);
      const response = await fetch("http://localhost:8080/delivery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          deliveryAddressId: parseInt(deliveryAddressId || "0"),
          deliveryTypeId: selectedDeliveryType,
          deliveryServiceProviderId: selectedServiceProvider,
          recipientName: finalRecipientName,
          recipientPhone: finalRecipientPhone,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create delivery");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error creating delivery:", error);
      throw error;
    }
  };

  const createOrder = async (deliveryId: string) => {
    try {
      const response = await fetch("http://localhost:8080/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId: parseInt(userId || "0"),
          deliveryId: parseInt(deliveryId || "0"),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const data = await response.json();
      console.log("order created successfully");
      return data;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch(
        `http://localhost:8080/cart/all?userId=${userId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete items from cart");
      }
    } catch (error) {
      console.error("Error deleting items from cart:", error);
    }
  };

  const handleSubmitOrderClick = async () => {
    try {
      const deliveryAddressId = await createDeliveryAddress();
      const deliveryId = await createDelivery(deliveryAddressId);
      const orderId = await createOrder(deliveryId);
      const clearCartStatus = await clearCart();

      console.log("Order created successfully with ID:", orderId);
      console.log("cleared shopping cart");
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  const handleEditCartToggle = () => {
    setIsCartEditing(!isCartEditing);
  };

  const isButtonDisabled = () => {
    return !firstName || !lastName || !phone;
  };

  function transliterateEnglishToUkrainian(text: string) {
    const transliterationMap: { [key: string]: string } = {
      a: "а",
      b: "б",
      c: "к",
      d: "д",
      e: "е",
      f: "ф",
      g: "г",
      h: "г",
      i: "і",
      j: "дж",
      k: "к",
      l: "л",
      m: "м",
      n: "н",
      o: "о",
      p: "п",
      q: "к",
      r: "р",
      s: "с",
      t: "т",
      u: "у",
      v: "в",
      w: "в",
      x: "кс",
      y: "и",
      z: "з",
      zh: "ж",
      kh: "х",
      ch: "ч",
      sh: "ш",
      ts: "ц",
      ii: "ій",
      yi: "иї",
      ya: "я",
      ia: "я",
      lv: "льв",
    };

    let result = "";

    for (let i = 0; i < text.length; i++) {
      let currentChar = text[i].toLowerCase();

      if (transliterationMap[currentChar]) {
        let combinedChars = currentChar + (text[i + 1] || "").toLowerCase();
        if (transliterationMap[combinedChars]) {
          console.log("YEAH");
          result += transliterationMap[combinedChars];
          console.log(result);

          i++;
        } else {
          result += transliterationMap[currentChar];
        }
      }
    }

    return result;
  }

  const handleCityInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const cityName = event.target.value.trim();
    setCityRegionInputValue(cityName);

    const transliteratedCityName = transliterateEnglishToUkrainian(cityName);
    console.log(transliteratedCityName);

    try {
      const response = await fetch("https://api.novaposhta.ua/v2.0/json/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          apiKey: "194a09f5a9168a1a562d28f8d81ad516",
          modelName: "Address",
          calledMethod: "getSettlements",
          methodProperties: {
            Page: "1",
            Warehouse: "1",
            FindByString: transliteratedCityName,
            Limit: "20",
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch cities");
      }

      const data = await response.json();
      setCities(data.data);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const handleAddressInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const [city, region] = selectedCityRegion.split(",");
    const addressInputValue = event.target.value.trim();
    setAddressInputValue(addressInputValue);

    try {
      if (selectedDeliveryType !== 9) {
        let methodProperties: { [key: string]: any } = {
          TypeOfWarehouseRef:
            selectedDeliveryType === 8
              ? "f9316480-5f2d-425d-bc2c-ac7cd29decf0"
              : "841339c7-591a-42e2-8233-7a0a00f0ed6f",
          CityName: transliterateEnglishToUkrainian(city.trim()),
        };

        if (/^[a-zA-Z]/.test(addressInputValue)) {
          methodProperties.FindByString =
            transliterateEnglishToUkrainian(addressInputValue);
        } else if (/^\d+$/.test(addressInputValue)) {
          methodProperties.WarehouseId = addressInputValue;
        }

        console.log("method properties", methodProperties);

        const response = await fetch("https://api.novaposhta.ua/v2.0/json/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            apiKey: "194a09f5a9168a1a562d28f8d81ad516",
            modelName: "Address",
            calledMethod: "getWarehouses",
            methodProperties: methodProperties,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch cities");
        }

        const data = await response.json();
        setAddresses(data.data);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const deliveryServiceImages: { [key: string]: string } = {
    "Nova Post": "/nova_post.png",
    "Ukr Post": "/ukr_post.png",
    Meest: "/meest.png",
  };
  const [selectedCityRegion, setSelectedCityRegion] = useState<string>("");
  const [showSelect, setShowSelect] = useState(false);
  const [address, setAddress] = useState<string>("");
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [showAddressSelect, setShowAddressSelect] = useState(false);

  const handleSelectClick = (selectedCityRegion: string) => {
    setSelectedCityRegion(selectedCityRegion);
    setCityRegionInputValue(selectedCityRegion);
    setShowSelect(!showSelect);
  };
  const toggleSelect = () => {
    setShowSelect(!showSelect);
  };
  const toggleAddressSelect = () => {
    setShowAddressSelect(!showAddressSelect);
  };

  const handleSelectAddressClick = (selectedAddress: string) => {
    setSelectedAddress(selectedAddress);
    setShowAddressSelect(!showAddressSelect);
    setAddressInputValue(selectedAddress);
  };

  return (
    <div className={styles.wrapper}>
      <h1>Create order</h1>
      <div className={styles.container}>
        <div className={styles.orderDetails}>
          <div className={styles.userInfoContainer}>
            <h2>Contact info</h2>
            <div className={styles.userInfo}>
              <div className={styles.userFullName}>
                <div className={styles.userInfoItem}>
                  <p className={styles.userInfoTitle}>First name</p>
                  <p>{customer?.firstName}</p>
                </div>
                <div className={styles.userInfoItem}>
                  <p className={styles.userInfoTitle}>Last name</p>
                  <p>{customer?.lastName}</p>
                </div>
              </div>
              <div className={styles.userInfoItem}>
                <p className={styles.userInfoTitle}>Email</p>
                <p>{customer?.email}</p>
              </div>
              <div className={styles.userInfoItem}>
                <p className={styles.userInfoTitle}>Phone number</p>
                <p>{customer?.phoneNumber}</p>
              </div>
            </div>
          </div>
          <div className={styles.recipientSwitch}>
            <label className={styles.formControl}>
              <input
                type="checkbox"
                checked={isRecipientOtherPerson}
                onChange={handleRecipientSwitchChange}
              />
              Recipient is the other person
            </label>
          </div>
          {isRecipientOtherPerson && (
            <div className={styles.additionalInputs}>
              <h2>Recipient info</h2>
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
                    <label className={styles.errorLabel}>
                      {firstNameError}
                    </label>
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
              </div>
            </div>
          )}
          <div className={styles.deliveryContainer}>
            <h2>Delivery info</h2>
            <div className={styles.deliveryServiceContainer}>
              <h2>Delivery Service Providers</h2>
              {deliveryServices.map((deliveryService, index) => (
                <div
                  className={styles.serviceProvider}
                  key={deliveryService.id}
                >
                  <label className={styles.formControl}>
                    <input
                      type="radio"
                      name="deliveryServiceProvider"
                      checked={selectedServiceProvider === deliveryService.id}
                      onChange={() =>
                        setSelectedServiceProvider(deliveryService.id)
                      }
                    />
                    <img
                      src={deliveryServiceImages[deliveryService.name]}
                      alt={deliveryService.name}
                      className={styles.deliveryServiceImage}
                      style={{ height: "16px" }}
                    />
                    {deliveryService.name}
                  </label>
                </div>
              ))}
            </div>
            <div className={styles.deliveryTypesContainer}>
              <h2>Delivery Types</h2>
              {deliveryTypes.map((deliveryType, index) => (
                <div className={styles.serviceProvider} key={deliveryType.id}>
                  <label className={styles.formControl}>
                    <input
                      type="radio"
                      name="deliveryType"
                      checked={selectedDeliveryType === deliveryType.id}
                      onChange={() => setSelectedDeliveryType(deliveryType.id)}
                    />
                    {deliveryType.name}
                  </label>
                  <p>{deliveryType.description}</p>
                </div>
              ))}
            </div>
            <div className={styles.form}>
              <div className={styles.inputContainer}>
                <p className={styles.inputName}>City</p>
                <div className={styles.citySelect}>
                  <div className={styles.toggleMoogle}>
                    <input
                      type="text"
                      placeholder="enter city"
                      value={cityRegionInputValue}
                      onChange={handleCityInputChange}
                      className={styles.inputBox}
                      onClick={toggleSelect}
                    />
                    <img
                      src={showSelect ? "closed.png" : "opened.png"}
                      style={{ height: "16px" }}
                    />
                  </div>

                  {showSelect && cityRegionInputValue != "" && (
                    <div className={styles.cityOptions}>
                      {cities.map((city) => (
                        <p
                          key={city.Ref}
                          className={styles.cityOption}
                          onClick={() =>
                            handleSelectClick(
                              `${city.DescriptionTranslit}, ${city.AreaDescriptionTranslit}`
                            )
                          }
                        >{`${city.DescriptionTranslit}, ${city.AreaDescriptionTranslit}`}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className={styles.inputContainer}>
                <p className={styles.inputName}>Address</p>
                <div className={styles.citySelect}>
                  <div className={styles.toggleMoogle}>
                    <input
                      type="text"
                      placeholder="enter address"
                      value={addressInputValue}
                      onChange={handleAddressInputChange}
                      className={styles.inputBox}
                      onClick={toggleAddressSelect}
                    />
                    <img
                      src={showAddressSelect ? "closed.png" : "opened.png"}
                      style={{ height: "16px" }}
                    />
                  </div>
                  {showAddressSelect && addressInputValue != "" && (
                    <div className={styles.cityOptions}>
                      {addresses.map((address) => (
                        <p
                          key={address.Ref}
                          onClick={() =>
                            handleSelectAddressClick(`${address.Number}`)
                          }
                        >
                          {address.Description}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.orderContentContainer}>
          <h2>{cart.length} items in cart</h2>
          <button onClick={handleEditCartToggle} className={styles.editButton}>
            <img src="/edit.png" style={{ height: "16px" }} alt="edit" />
          </button>
          {cart.map((item) => (
            <div key={item.bookId} className={styles.item}>
              <div className={styles.cover}>
                <img
                  src={item.shortInfoBook.imageUrl}
                  alt={item.shortInfoBook.title}
                  className={styles.itemImage}
                  style={{ height: "90px" }}
                />
              </div>
              <div className={styles.infoContainer}>
                <div className={styles.title}>{item.shortInfoBook.title}</div>
                <div className={styles.author}>
                  {item.shortInfoBook.authors}
                </div>
                {!isCartEditing && (
                  <div>
                    <div className={styles.quantityContainer}>
                      <div>Quantity: {item.quantity}</div>
                    </div>
                    <div className={styles.price}>
                      Price: ${item.shortInfoBook.price}
                    </div>
                  </div>
                )}
                {isCartEditing && (
                  <div className={styles.editControls}>
                    <div className={styles.quantityContainer}>
                      <button
                        onClick={() =>
                          handleQuantityChange(item.bookId, item.quantity - 1)
                        }
                        className={styles.decreaseQuantityButton}
                        disabled={item.quantity === 1}
                      >
                        -
                      </button>
                      <div>{item.quantity}</div>
                      <button
                        onClick={() =>
                          handleQuantityChange(item.bookId, item.quantity + 1)
                        }
                        className={styles.increaseQuantityButton}
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => handleDeleteItem(item.bookId)}
                      className={styles.deleteItemButton}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          <div className={styles.total}>
            <h3>Total: ${calculateTotal()}</h3>
          </div>
          <button
            className={`${styles.submitButton} ${
              isButtonDisabled() ? styles.disabled : ""
            }`}
            onClick={handleSubmitOrderClick}
            disabled={isButtonDisabled()}
          >
            Submit order
          </button>
        </div>
      </div>
    </div>
  );
}

export default Order;
