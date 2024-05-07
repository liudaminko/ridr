import React, { useState } from "react";
import styles from "./PropertiesCheckboxes.module.css";

const PropertiesCheckboxes = ({ properties, handleCheckboxChange }) => {
  const [selectedCheckboxes, setSelectedCheckboxes] = useState({});

  const toggleCheckbox = (key) => {
    setSelectedCheckboxes((prevSelected) => ({
      ...prevSelected,
      [key]: !prevSelected[key],
    }));
  };

  const renderCheckboxes = (prop, key) => {
    if (typeof prop === "object" && prop !== null) {
      return (
        <div key={key} className={styles.property}>
          <h3>{key}</h3>
          <div className={styles.checkboxContainer}>
            {Object.entries(prop).map(([subKey, subProp]) =>
              renderCheckboxes(subProp, subKey)
            )}
          </div>
        </div>
      );
    }

    return (
      <div key={key} className={styles.checkboxLabelContainer}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={selectedCheckboxes[key] || false}
            onChange={() => {
              toggleCheckbox(key);
              handleCheckboxChange(key); // Pass the key to the parent component
            }}
          />
          {prop}
        </label>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <h2>Properties</h2>
      {Object.entries(properties).map(([key, prop]) =>
        renderCheckboxes(prop, key)
      )}
    </div>
  );
};

export default PropertiesCheckboxes;
