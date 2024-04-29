import React, { useState } from "react";
import styles from "./EntityEditor.module.css";
import ActionSelector from "../../components/ActionsSelector/ActionSelector";
import FetchRequestResults from "../FetchRequestResults/FetchRequestResults";
import EditEntity from "./EditEntity";

interface Field {
  id: string;
  name: string;
  label: string;
  type: string;
  value: string;
  options?: { id: number; name: string }[]; // Options for select fields
  onChange: (id: string, value: string) => void;
}

interface EntityEditorProps {
  title: string; // Represents the entity type
  fields: Field[];
  filters: { [key: string]: string }; // Filters for the entity
  deleteField: Field[];
  handleEditInputChange: (entity: string, value: string) => void;
  setFields: React.Dispatch<Field[]>;
  // Function to fetch options based on input value
}

function EntityEditor({
  title,
  fields,
  filters,
  deleteField,
  handleEditInputChange,
  setFields,
}: EntityEditorProps) {
  const [selectedAction, setSelectedAction] = useState<string | null>("View");
  const [isNoFilters, setIsNoFilters] = useState(true);
  const [showFields, setShowFields] = useState(false);
  const [rowCount, setRowCount] = useState<number>(10);
  const [fetchData, setFetchData] = useState<any[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<{
    [key: string]: string;
  }>({});

  const handleSelectAction = (action: string) => {
    setSelectedAction(action);
    setSelectedFilters({});
    clearFields(); // Clear fields when action changes
  };

  const renderFields = () => {
    console.log(fields);
    return fields.map((field) => (
      <div key={field.id} className={styles.field}>
        <label htmlFor={field.id} className={styles.inputSearch}>
          {field.label}
          {field.options ? (
            <div className={styles.filterItem}>
              <input
                type={field.type}
                id={field.id}
                name={field.name}
                className={styles.inputSmall}
                value={field.value}
                onChange={(e) => {
                  field.onChange(field.id, e.target.value);
                }}
              />
              <select
                id={field.id}
                name={field.name}
                value={field.value}
                onChange={(e) => {
                  field.onChange(field.id, e.target.value);
                }}
              >
                {field.options.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <input
              type={field.type}
              id={field.id}
              name={field.name}
              className={styles.inputSmall}
              value={field.value} // Use field.value to reflect current state
              onChange={(e) => {
                console.log(`Field ${field.id} value changed:`, e.target.value);
                field.onChange(field.id, e.target.value);
              }}
            />
          )}
        </label>
      </div>
    ));
  };

  const toggleShowFields = () => {
    setShowFields(!showFields);
  };

  const handleRowCountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowCount(Number(e.target.value));
  };

  const clearFields = () => {
    const clearedFields = fields.map((field) => ({
      ...field,
      value: "", // Clear the value of each field
    }));
    setFields(clearedFields);
    handleEditInputChange(title.toLowerCase(), "");
    deleteField.map((field) => {
      field.onChange(field.id, "");
    });
  };

  const handleNoFiltersChange = () => {
    setIsNoFilters(!isNoFilters);
    setSelectedFilters({});
    setFetchData([]);
  };

  const handleFilterToggle = (fieldName: string) => {
    setSelectedFilters((prevFilters) => {
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
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [fieldName]: value,
    }));
  };

  const handleExecuteRequest = async () => {
    const baseUrl = `http://localhost:8080/${title.toLowerCase()}`;
    console.log(baseUrl);

    let filterParams = Object.entries(selectedFilters)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

    let requestParams = "";

    if (selectedAction === "View" && isNoFilters) {
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
      let requestOptions: any = {
        method: "GET",
      };

      if (selectedAction === "Add") {
        requestOptions.method = "POST";
        requestOptions.headers = { "Content-Type": "application/json" };

        const requestBody = fields.reduce((acc, curr) => {
          acc[curr.id] = curr.value;
          return acc;
        }, {} as { [key: string]: any }); // Type assertion here
        console.log(requestBody);
        requestOptions.body = JSON.stringify(requestBody);
      } else if (selectedAction === "Delete") {
        requestOptions.method = "DELETE";
        const deleteUrl = `${baseUrl}?${deleteField[0].name}=${deleteField[0].value}`;
        console.log(deleteUrl);
        const response = await fetch(deleteUrl, requestOptions);
        if (!response.ok) {
          throw new Error("Failed to delete data");
        }
        const data = await response.json();
        clearFields();
        return;
      }

      const response = await fetch(requestUrl, requestOptions);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setFetchData(data);
      clearFields();
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

      {selectedAction === "View" && showFields && (
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
                  {Object.entries(filters).map(([filterName, label]) => (
                    <div key={filterName} className={styles.filterItem}>
                      <label
                        onClick={() => handleFilterToggle(filterName)}
                        className={`${styles.filterLabel} ${
                          selectedFilters[filterName] !== undefined
                            ? styles.selected
                            : ""
                        }`}
                      >
                        {label}
                      </label>
                      {selectedFilters[filterName] !== undefined && (
                        <input
                          type="text"
                          value={selectedFilters[filterName]}
                          onChange={(e) => handleFilterChange(e, filterName)}
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

      {selectedAction === "Add" && showFields && (
        <div className={styles.actionFields}>
          {renderFields()}
          <button
            onClick={handleExecuteRequest}
            className={styles.requestButton}
          >
            {selectedAction}
          </button>
          {fetchData.length > 0 && <FetchRequestResults data={fetchData} />}
        </div>
      )}
      {selectedAction === "Edit" && showFields && (
        <EditEntity
          title={title}
          fields={fields}
          oldValueField={deleteField}
          handleEditInputChange={handleEditInputChange}
          setFields={setFields}
        />
      )}

      {selectedAction === "Delete" && showFields && (
        <div className={styles.actionFields}>
          {deleteField.map((field) => (
            <div key={field.id} className={styles.field}>
              <label htmlFor={field.id} className={styles.inputSearch}>
                {field.label}
                <input
                  type={field.type}
                  id={field.id}
                  name={field.name}
                  value={field.value}
                  className={styles.inputSmall}
                  onChange={(e) => field.onChange(field.id, e.target.value)}
                />
              </label>
            </div>
          ))}
          <button
            onClick={handleExecuteRequest}
            className={styles.requestButton}
          >
            {selectedAction}
          </button>
        </div>
      )}
    </div>
  );
}

export default EntityEditor;
