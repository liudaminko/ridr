import { useState } from "react";
import styles from "./EntityEditor.module.css";
import ActionSelector from "../../components/ActionsSelector/ActionSelector";
import FetchRequestResults from "../FetchRequestResults/FetchRequestResults";

interface Field {
  name: string;
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
}

interface EntityEditorProps {
  title: string; // Represents the entity type
  fields: Field[];
}

function EntityEditor({ title, fields }: EntityEditorProps) {
  const [selectedAction, setSelectedAction] = useState<string | null>("View");
  const [isNoFilters, setIsNoFilters] = useState(true);
  const [showFields, setShowFields] = useState(false);
  const [rowCount, setRowCount] = useState<number>(10);
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [fetchData, setFetchData] = useState<any[]>([]); // For simulating fetch data

  const handleSelectAction = (action: string) => {
    setSelectedAction(action);
    setShowFields(false); // Reset showFields when action changes
  };

  const renderFields = () => {
    return fields.map((field) => (
      <div key={field.name} className={styles.field}>
        <label>{field.label}</label>
        <input
          type={field.type}
          value={field.value}
          onChange={(e) => field.onChange(e.target.value)}
        />
      </div>
    ));
  };

  const toggleShowFields = () => {
    setShowFields(!showFields);
  };

  const handleRowCountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowCount(Number(e.target.value));
  };

  const handleNoFiltersChange = () => {
    setIsNoFilters(!isNoFilters);
    setFilters({});
  };

  const handleFilterToggle = (fieldName: string) => {
    setFilters((prevFilters) => {
      if (prevFilters[fieldName] !== undefined) {
        console.log("Filter already exists, removing:", fieldName);
        const { [fieldName]: removedFilter, ...restFilters } = prevFilters;
        return restFilters;
      } else {
        console.log("Filter does not exist, adding:", fieldName);
        return { ...prevFilters, [fieldName]: "" };
      }
    });
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string
  ) => {
    const value = e.target.value;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [fieldName]: value,
    }));
  };

  const handleExecuteRequest = async () => {
    const baseUrl = `http://localhost:8080/${title.toLowerCase()}`;
    console.log(baseUrl);

    let filterParams = Object.entries(filters)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

    let requestParams = "";

    if (isNoFilters) {
      requestParams = `limit=${rowCount}`;
    } else {
      requestParams = filterParams;
    }

    const requestUrl = `${baseUrl}?${requestParams}`;

    console.log(
      `Executing request for ${rowCount} rows with action: ${selectedAction}`
    );
    console.log("Request URL:", requestUrl);

    try {
      const response = await fetch(requestUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setFetchData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.entityControls}>
        <h3>{title}</h3>
        <div className={styles.toggles}>
          <ActionSelector onSelectAction={handleSelectAction} />
          <img
            src={showFields ? "opened.png" : "closed.png"}
            onClick={toggleShowFields}
            style={{ height: "16px", cursor: "pointer" }}
            alt={showFields ? "opened" : "closed"}
          />
        </div>
      </div>

      {(selectedAction === "View" || selectedAction === "Delete") &&
        showFields && (
          <div className={styles.actionFields}>
            <div className={styles.fetchingHeader}>
              <div className={styles.fetchingFilters}>
                <div className={styles.fetching}>
                  <label className={styles.formControl}>
                    <input
                      type="checkbox"
                      checked={isNoFilters}
                      onChange={handleNoFiltersChange}
                    />
                    no filters
                  </label>
                  {isNoFilters && (
                    <label className={styles.fetchingRowsProps}>
                      Rows to fetch:
                      <select
                        onChange={handleRowCountChange}
                        value={rowCount}
                        className={styles.selector}
                      >
                        <option value={10}>10</option>
                        <option value={100}>100</option>
                        <option value={1000}>1000</option>
                        <option value={-1}>All</option>
                      </select>
                    </label>
                  )}
                </div>
                {!isNoFilters && (
                  <div className={styles.filters}>
                    {fields.map((field) => (
                      <div key={field.name} className={styles.filterItem}>
                        <label
                          onClick={() => handleFilterToggle(field.name)}
                          className={`${styles.filterLabel} ${
                            filters[field.name] !== undefined
                              ? styles.selected
                              : ""
                          }`}
                        >
                          {field.label}
                        </label>
                        {filters[field.name] !== undefined && (
                          <input
                            type={field.type}
                            value={filters[field.name]}
                            onChange={(e) => handleFilterChange(e, field.name)}
                            className={styles.inputBox}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={handleExecuteRequest}
                className={styles.requestButton}
              >
                Execute Request
              </button>
            </div>
            {fetchData.length > 0 && <FetchRequestResults data={fetchData} />}
          </div>
        )}

      {selectedAction !== "View" &&
        selectedAction !== "Delete" &&
        showFields && (
          <div className={styles.actionFields}>
            {renderFields()}
            <button
              onClick={handleExecuteRequest}
              className={styles.requestButton}
            >
              Execute Request
            </button>
            {fetchData.length > 0 && <FetchRequestResults data={fetchData} />}
          </div>
        )}
    </div>
  );
}

export default EntityEditor;
