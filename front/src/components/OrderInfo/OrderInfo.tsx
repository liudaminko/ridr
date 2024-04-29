import { useEffect, useState } from "react";
import styles from "./OrderInfo.module.css";

interface BookOrder {
  orderId: number;
  bookId: number;
  sequenceNumber: number;
  quantity: number;
  shortInfoBook: {
    id: number;
    title: string;
    imageUrl: string;
    authors: string;
    price: number;
  };
}

interface DeliveryInfo {
  address: string;
  cityRegion: string;
  cost: number;
  weight: number;
  serviceName: string;
  trackNumber: string;
  trackInfo: [
    {
      description: string;
      start_date_time: string;
    }
  ];
}

interface OrderInfoProps {
  orderId: number | undefined;
}

function OrderInfo({ orderId }: OrderInfoProps) {
  const [order, setOrder] = useState<BookOrder[]>([]);
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>();

  useEffect(() => {
    const fetchOrderDeliveryInfo = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/delivery/full?orderId=${orderId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        setDeliveryInfo(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchOrderDeliveryInfo();

    const fetchOrder = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/order/full?orderId=${orderId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch cart data");
        }
        const data = await response.json();
        console.log(data);
        setOrder(data);
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };
    fetchOrder();
  }, [orderId]);

  const calculateTotal = () => {
    return order.reduce(
      (total, item) => total + item.quantity * item.shortInfoBook.price,
      0
    );
  };

  return (
    <div className={styles.container}>
      <h1>Order №{orderId}</h1>
      <div className={styles.fullOrderInfoContainer}>
        <div className={styles.orderContent}>
          <h2>{order.length} books in order</h2>
          {order.map((item) => (
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
                <div>
                  <div className={styles.quantityContainer}>
                    <div>Quantity: {item.quantity}</div>
                  </div>
                  <div className={styles.price}>
                    Price: ${item.shortInfoBook.price}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className={styles.total}>
            <h3>Total: ${calculateTotal()}</h3>
          </div>
          {deliveryInfo && (
            <div className={styles.deliveryFullInfoContainer}>
              <h2>Delivery Info</h2>
              <div className={styles.deliveryInfoContainer}>
                <div className={styles.deliveryInfoItem}>
                  <p style={{ fontWeight: "bold" }}>Track number: </p>
                  <p>{deliveryInfo.trackNumber}</p>
                </div>
                <div className={styles.deliveryInfoItem}>
                  <p style={{ fontWeight: "bold" }}>Delivery address: </p>
                  <p>
                    {deliveryInfo.cityRegion}, {deliveryInfo.address}
                  </p>
                </div>
                <div className={styles.deliveryInfoItem}>
                  <p style={{ fontWeight: "bold" }}>
                    Delivery service provider:{" "}
                  </p>
                  <p>{deliveryInfo.serviceName}</p>
                </div>
                <div className={styles.deliveryInfoItem}>
                  <p style={{ fontWeight: "bold" }}>Cost: </p>
                  <p>{deliveryInfo.cost}</p>
                </div>
                <div className={styles.deliveryInfoItem}>
                  <p style={{ fontWeight: "bold" }}>Weight: </p>
                  <p>{deliveryInfo.weight} kg</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {deliveryInfo?.trackInfo && (
          <div className={styles.deliveryHistoryContainer}>
            <h2>Delivery History</h2>
            <div>
              {deliveryInfo.trackInfo.map((track, index) => (
                <div key={index} className={styles.trackItem}>
                  <div className={styles.deliveryPoint}>
                    <p className={styles.pathSymbol}>✹</p>
                    <div className={styles.trackDescription}>
                      <p>{track.description}</p>
                      <p className={styles.timestamp}>
                        {track.start_date_time}
                      </p>
                    </div>
                  </div>
                  {deliveryInfo.trackInfo.length > index + 1 && (
                    <div className={styles.pathDots}>
                      <p className={styles.pathSymbol}>•</p>
                      <p className={styles.pathSymbol}>•</p>
                      <p className={styles.pathSymbol}>•</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderInfo;
