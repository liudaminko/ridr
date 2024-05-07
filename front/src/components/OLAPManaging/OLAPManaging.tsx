import { useState } from "react";
import styles from "./OLAPManaging.module.css";
import PropertiesCheckboxes from "./PropertiesCheckboxes";
import { useModal } from "../../ModalContext";
import ErrorModal from "../ErrorModal/ErrorModal";

function OLAPManaging() {
  const tableNames = ["Book_Sale_Fact", "Delivery_Fact", "Order_Fact"];
  const fileFormats = ["JSON", "CSV"];
  const limits = ["100", "1000", "10000", "all"];

  const [selectedTable, setSelectedTable] = useState("Book_Sale_Fact");
  const [selectedFileFormat, setSelectedFileFormat] = useState("JSON");
  const [selectedLimit, setSelectedLimit] = useState("100");
  const [selectedColumns, setSelectedColumns] = useState([]);

  const properties = {
    Book_Sale_Fact: {
      order_id: "order id",
      book: {
        title: "title",
        genre: "genre",
        publising_year: "publishing year",
        publisher: "publisher",
        language: "language",
        authors: "authors",
      },
      customer: {
        full_name: "full name",
        sex: "gender",
      },
      age: {
        age: "age",
        age_group: "age group",
      },
      unit_price: "price",
    },
    Delivery_Fact: {
      orderId: "Order ID",
      delivery_type: "Delivery type",
      delivery_service_provider: "Delivery service provider",
      delivery_address: {
        region: "Region",
        city: "City",
        address: "Address",
      },
      cost: "Cost",
      weight: "Weight",
      warehouse_processing_time: "Warehouse processing time",
      delivery_warehouse_service_provider_time:
        "Delivery from warehouse to service provider time",
      service_delivery_time: "Service delivery time",
      total_delivery_time: "Total delivery time",
    },
    Order_Fact: {
      order_id: "Order ID",
      customer: {
        full_name: "Full name",
        sex: "Gender",
      },
      age: {
        age: "Age",
        age_group: "Age group",
      },
      date: {
        year: "Year",
        quarter: "Quarter",
        month: "Month",
        day: "Day",
        day_of_week: "Day of Week",
        day_of_month: "Day of Month",
      },
      time: {
        hour: "Hour",
        minute: "Minute",
      },
      delivery_address: {
        region: "Region",
        city: "City",
        address: "Address",
      },
      total_quantity: "Total quantity",
      total_amount: "Total amount",
    },
  };

  const { toggleErrorPopup, setErrorPopupText } = useModal();
  const [loading, setLoading] = useState(false);

  const handleTableSelect = (event) => {
    setSelectedTable(event.target.value);
    setSelectedColumns([]);
  };
  const handleFileFormatSelect = (event) => {
    setSelectedFileFormat(event.target.value);
  };
  const handleLimitSelect = (event) => {
    setSelectedLimit(event.target.value);
  };

  const handleUpdateClick = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:500/run-script`);
      if (response.ok && response != null) {
        const data = await response.json();
      } else {
        setErrorPopupText("something went wrong while updating OLAP db");
        toggleErrorPopup();
        return;
      }
    } catch (error) {
      setErrorPopupText(error);
      toggleErrorPopup();
    } finally {
      setLoading(false);
    }
  };

  const handleExportClick = async () => {
    try {
      const db =
        selectedTable === "Book_Sale_Fact"
          ? "book"
          : selectedTable === "Delivery_Fact"
          ? "delivery"
          : "order";

      const selectedProperties = Object.values(
        properties[selectedTable]
      ).flat();

      const selectedColumnsString = selectedColumns.join(",");
      const url = `http://localhost:8080/export/${db}/${selectedFileFormat.toLowerCase()}?selectedColumns=${selectedColumnsString}&limit=${selectedLimit}`;
      console.log(url);
      const response = await fetch(url);

      if (response.ok) {
        const blob = await response.blob();

        const blobUrl = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = `${selectedTable.toLowerCase()}.${selectedFileFormat.toLowerCase()}`;

        link.click();

        window.URL.revokeObjectURL(blobUrl);
      } else {
        throw new Error("Failed to export data");
      }
    } catch (error) {
      setErrorPopupText(error.message);
      toggleErrorPopup();
    }
  };

  const handleCheckboxChange = (key) => {
    setSelectedColumns((prevSelectedColumns) => {
      if (prevSelectedColumns.includes(key)) {
        return prevSelectedColumns.filter((column) => column !== key);
      } else {
        return [...prevSelectedColumns, key];
      }
    });
    console.log("Checkbox key:", key);
  };

  return (
    <div className={styles.container}>
      <button onClick={handleUpdateClick} className={styles.updateButton}>
        {loading ? <div className={styles.spinner} /> : "Update OLAP"}
      </button>
      <div className={styles.exportContainer}>
        <h1>Export</h1>
        <div className={styles.exportSettings}>
          <select
            onChange={handleTableSelect}
            value={selectedTable}
            className={styles.select}
          >
            {tableNames.map((tableName, index) => (
              <option key={index} value={tableName}>
                {tableName}
              </option>
            ))}
          </select>
          <select
            onChange={handleFileFormatSelect}
            value={selectedFileFormat}
            className={styles.select}
          >
            {fileFormats.map((fileFormat, index) => (
              <option key={index} value={fileFormat}>
                {fileFormat}
              </option>
            ))}
          </select>
          <select
            onChange={handleLimitSelect}
            value={selectedLimit}
            className={styles.select}
          >
            {limits.map((limit, index) => (
              <option key={index} value={limit}>
                {limit}
              </option>
            ))}
          </select>
          <button className={styles.updateButton} onClick={handleExportClick}>
            Export
          </button>
        </div>

        {selectedTable && (
          <PropertiesCheckboxes
            properties={properties[selectedTable]}
            handleCheckboxChange={handleCheckboxChange}
          />
        )}
      </div>
      <ErrorModal />
    </div>
  );
}

export default OLAPManaging;
