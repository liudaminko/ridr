import React, { useState, useEffect } from "react";
import styles from "./EntityEditor.module.css";
import FetchRequestResults from "../FetchRequestResults/FetchRequestResults";
import ActionSelector from "../../components/ActionsSelector/ActionSelector";

interface Field {
  id: string;
  name: string;
  label: string;
  type: string;
  value: string;
  options?: { id: number; name: string }[];
  onChange: (id: string, value: string) => void;
}

interface BookEntityEditorProps {
  title: string;
  fields: Field[];
  filters: { [key: string]: string };
  deleteField: Field[];
}

function BookEntityEditor({
  title,
  fields,
  filters,
  deleteField,
}: BookEntityEditorProps) {
  const [genreOptions, setGenreOptions] = useState<
    { id: number; name: string }[]
  >([]);
  const [publisherOptions, setPublisherOptions] = useState<
    { id: number; name: string }[]
  >([]);
  const [fetchData, setFetchData] = useState<any[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<{
    [key: string]: string;
  }>({});
  const [rowCount, setRowCount] = useState<number>(10);
  const [isNoFilters, setIsNoFilters] = useState(true);
  const [showFields, setShowFields] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>("View");

  useEffect(() => {
    fetchGenres("");
    fetchPublishers("");
  }, []);

  const fetchGenres = async (name: string) => {
    try {
      const response = await fetch(`http://localhost:8080/genre?name=${name}`);
      if (!response.ok) {
        throw new Error("Failed to fetch genres");
      }
      const data = await response.json();
      setGenreOptions(data);
      console.log("genres", genreOptions);
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  };

  const fetchPublishers = async (name: string) => {
    try {
      const response = await fetch(
        `http://localhost:8080/publisher?name=${name}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch publishers");
      }
      const data = await response.json();
      setPublisherOptions(data);
      console.log("publishers", publisherOptions);
    } catch (error) {
      console.error("Error fetching publishers:", error);
    }
  };

  const handleFieldChange = (id: string, value: string) => {
    fields = fields.map((field) =>
      field.id === id ? { ...field, value } : field
    );
  };

  const handleSelectFieldChange = (id: string, value: string) => {
    if (id === "genre") {
      fetchGenres(value);
    } else if (id === "publisher") {
      fetchPublishers(value);
    }

    fields = fields.map((field) =>
      field.id === id ? { ...field, value } : field
    );
  };

  const toggleShowFields = () => {
    setShowFields(!showFields);
  };

  const renderFields = () => {
    return fields.map((field) => (
      <div key={field.id} className={styles.field}>
        <label htmlFor={field.id} className={styles.inputSearch}>
          {field.label}
          {field.options ? (
            <div className={styles.searchContainer}>
              <input
                type={field.type}
                id={field.id}
                name={field.name}
                value={field.value}
                className={styles.inputSmall}
                onChange={(e) => {
                  handleSelectFieldChange(field.id, e.target.value);
                  field.onChange(field.id, e.target.value);
                }}
              />
              {field.name === "genre" ? (
                <select
                  id={field.id}
                  name={field.name}
                  value={field.value}
                  className={styles.select}
                  onChange={(e) => field.onChange(field.id, e.target.value)}
                >
                  {genreOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              ) : field.name === "publisher" ? (
                <select
                  id={field.id}
                  name={field.name}
                  value={field.value}
                  className={styles.select}
                  onChange={(e) => field.onChange(field.id, e.target.value)}
                >
                  {publisherOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  id={field.id}
                  name={field.name}
                  value={field.value}
                  className={styles.inputSmall}
                  onChange={(e) => field.onChange(field.id, e.target.value)}
                />
              )}
            </div>
          ) : (
            <input
              type={field.type}
              id={field.id}
              name={field.name}
              value={field.value}
              className={styles.inputSmall}
              onChange={(e) => field.onChange(field.id, e.target.value)}
            />
          )}
        </label>
      </div>
    ));
  };

  const handleRowCountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowCount(Number(e.target.value));
  };

  const handleNoFiltersChange = () => {
    setSelectedFilters({});
    setFetchData([]);
  };

  const handleFilterToggle = (fieldName: string) => {
    setSelectedFilters((prevFilters) => {
      if (prevFilters[fieldName] !== undefined) {
        const { [fieldName]: removedFilter, ...restFilters } = prevFilters;
        return restFilters;
      } else {
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

  const handleSelectAction = (action: string) => {
    setSelectedAction(action);
    setSelectedFilters({});
  };

  const handleExecuteRequest = async () => {
    const baseUrl = `http://localhost:8080/${title.toLowerCase()}`;
    let filterParams = Object.entries(selectedFilters)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

    let requestParams = "";

    if (isNoFilters && selectedAction === "View") {
      requestParams = `limit=${rowCount}`;
    } else {
      requestParams = filterParams;
    }

    const requestUrl = `${baseUrl}?${requestParams}`;

    try {
      let requestOptions: any = {
        method: "GET",
      };

      if (selectedAction === "Add" || selectedAction === "Edit") {
        requestOptions.method = selectedAction === "Add" ? "POST" : "PUT";
        requestOptions.headers = { "Content-Type": "application/json" };

        const requestBody = {
          title: fields.find((field) => field.id === "title")?.value,
          description: fields.find((field) => field.id === "description")
            ?.value,
          price: parseInt(
            fields.find((field) => field.id === "price")?.value ?? "0",
            10
          ),
          publicationYear: parseInt(
            fields.find((field) => field.id === "publicationYear")?.value ??
              "0",
            10
          ),
          pages: parseInt(
            fields.find((field) => field.id === "pages")?.value ?? "0",
            10
          ),
          isbn: fields.find((field) => field.id === "isbn")?.value,
          language: fields.find((field) => field.id === "language")?.value,
          imageUrl: fields.find((field) => field.id === "imageUrl")?.value,
          genre: parseInt(
            fields.find((field) => field.id === "genre")?.value ?? "0",
            10
          ),
          publisher: parseInt(
            fields.find((field) => field.id === "publisher")?.value ?? "0",
            10
          ),
        };

        requestOptions.body = JSON.stringify(requestBody);
      } else if (selectedAction === "Delete") {
        requestOptions.method = "DELETE";
        const isbn = deleteField.find((field) => field.id === "isbn")?.value;
        const deleteUrl = `${baseUrl}?isbn=${isbn}`;
        console.log(deleteUrl);
        const response = await fetch(deleteUrl, requestOptions);
        if (!response.ok) {
          throw new Error("Failed to delete data");
        }
        const data = await response.json();
        return;
      }

      const response = await fetch(requestUrl, requestOptions);
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

      {selectedAction !== "View" &&
        selectedAction !== "Delete" &&
        showFields && (
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

export default BookEntityEditor;
