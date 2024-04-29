import styles from "./OrdersHistorySidebar.module.css";
import { useEffect, useState } from "react";

interface ShortInfoOrder {
  id: number;
  createdAt: string;
}

interface OrdersSidebarProps {
  orderId: number | undefined;
  setOrderId: (orderId: number | undefined) => void;
}

function OrdersHistorySidebar({ orderId, setOrderId }: OrdersSidebarProps) {
  const [orders, setOrders] = useState<ShortInfoOrder[]>([]);

  const [userId, setUserId] = useState<string | null>(
    localStorage.getItem("userId")
  );

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/order?userId=${userId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        console.log("Data received:", data);

        const ordersArray = Object.keys(data).map((orderId) => ({
          id: parseInt(data[orderId].orderId),
          createdAt: data[orderId].date,
        }));

        setOrders(ordersArray);
        setOrderId(ordersArray[0].id);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserOrders();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Your orders</h1>
      <div className={styles.ordersContainer}>
        {orders.map((order, index) => (
          <div
            key={index}
            className={`${styles.order} ${
              orderId === order.id ? styles.selected : ""
            }`}
            onClick={() => setOrderId(order.id)}
          >
            <h3>Order №{order.id}</h3>
            <p key={order.id} className={styles.additionalInfo}>
              {order.createdAt}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrdersHistorySidebar;
