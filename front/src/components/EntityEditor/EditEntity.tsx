import React, { useState, useEffect } from "react";
import styles from "./EntityEditor.module.css";

interface Field {
  id: string;
  name: string;
  label: string;
  type: string;
  value: string;
  options?: { id: number; name: string }[];
  onChange: (id: string, value: string) => void;
}

interface EditEntityProps {
  title: string;
  fields: Field[];
  oldValueField: Field[];
  handleEditInputChange: (entity: string, value: string) => void;
  setFields: React.Dispatch<Field[]>;
}

function EditEntity({
  title,
  fields,
  oldValueField,
  handleEditInputChange,
  setFields,
}: EditEntityProps) {
  const [fetchData, setFetchData] = useState<any>(null);

  useEffect(() => {
    if (fetchData && Object.keys(fetchData).length > 0) {
      const updatedFields = fields.map((field) => {
        const fieldValue = fetchData[field.id];
        if (fieldValue !== undefined) {
          return { ...field, value: fieldValue };
        } else {
          return field;
        }
      });
      setFields(updatedFields);
    }
  }, [fetchData, oldValueField]);

  const renderFields = () => {
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
              value={field.value}
              onChange={(e) => {
                field.onChange(field.id, e.target.value);
              }}
            />
          )}
        </label>
      </div>
    ));
  };

  const handleExecuteRequest = async () => {
    const baseUrl = `http://localhost:8080/${title.toLowerCase()}`;

    try {
      let requestOptions: any = {
        method: "PUT",
      };
      requestOptions.headers = { "Content-Type": "application/json" };

      const requestBody = fields.reduce((acc, curr) => {
        acc[curr.id] = curr.value;
        return acc;
      }, {} as { [key: string]: any }); // Type assertion here
      requestBody.oldName = oldValueField[0].value;
      console.log(requestBody);

      requestOptions.body = JSON.stringify(requestBody);
      const response = await fetch(baseUrl, requestOptions);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setFetchData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchFullData = async (name: string) => {
    try {
      const response = await fetch(
        `http://localhost:8080/${title.toLocaleLowerCase()}/full?name=${name}`
      );
      if (response.ok) {
        const data = await response.json();
        setFetchData(data);
      } else {
        console.error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.actionFields}>
        {oldValueField.map((field) => (
          <div key={field.id} className={styles.field}>
            <label htmlFor={field.id} className={styles.inputSearch}>
              Old {field.label}
              <input
                type={field.type}
                id={field.id}
                name={field.name}
                value={field.value}
                className={styles.inputSmall}
                onChange={(e) => {
                  field.onChange(field.id, e.target.value);
                  handleEditInputChange(
                    title.toLocaleLowerCase(),
                    e.target.value
                  );
                }}
              />
            </label>
            <select
              id={field.id}
              name={field.name}
              value={field.value}
              onChange={(e) => {
                field.onChange(field.id, e.target.value);
                fetchFullData(e.target.value);
              }}
            >
              {field.options?.map((option) => (
                <option key={option.id} value={option.name}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
        ))}
        {renderFields()}
        <button onClick={handleExecuteRequest} className={styles.requestButton}>
          Submit
        </button>
      </div>
    </div>
  );
}

export default EditEntity;
