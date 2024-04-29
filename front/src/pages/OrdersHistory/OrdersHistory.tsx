import styles from "./OrderHistory.module.css";
import OrdersHistorySidebar from "../../components/OrdersHistorySidebar/OrdersHistorySidebar";
import { useEffect, useState } from "react";
import OrderInfo from "../../components/OrderInfo/OrderInfo";

function OrdersHistory() {
  const [orderId, setOrderId] = useState<number>();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Orders history</h1>
        <img src="/order.png" style={{ height: "40px" }} />
      </div>
      <div className={styles.orderInfoContainer}>
        <OrdersHistorySidebar orderId={orderId} setOrderId={setOrderId} />
        <OrderInfo orderId={orderId} />
      </div>
    </div>
  );
}

export default OrdersHistory;
