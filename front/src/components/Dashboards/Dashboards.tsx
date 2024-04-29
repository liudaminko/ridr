import React, { useEffect, useRef, useState } from "react";
import styles from "./Dashboards.module.css";
import Dashboard1 from "./Dashboard1";
import Dashboard2 from "./Dashboard2";

function Dashboards() {
  const [dashNumber, setDashNumber] = useState(1);
  return (
    <div className={styles.container}>
      <h1>Dashboards</h1>
      <div className={styles.dashboardContainer}>
        {dashNumber === 1 ? <Dashboard1 /> : <Dashboard2 />}
      </div>
      <div className={styles.navigationButtons}>
        <button
          onClick={() => setDashNumber(1)}
          className={`${styles.action} ${
            dashNumber === 1 ? styles.selected : ""
          }`}
        >
          1
        </button>
        <button
          onClick={() => setDashNumber(2)}
          className={`${styles.action} ${
            dashNumber === 2 ? styles.selected : ""
          }`}
        >
          2
        </button>
      </div>
    </div>
  );
}

export default Dashboards;
