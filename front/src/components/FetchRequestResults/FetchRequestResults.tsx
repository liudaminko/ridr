import React from "react";
import styles from "./FetchRequestResults.module.css";

interface DataItem {
  [key: string]: any;
}

interface FetchRequestResultsProps {
  data: DataItem[];
}

function truncateDescription(description: string, maxLength: number) {
  if (description.length <= maxLength) {
    return description;
  }
  return description.slice(0, maxLength) + "...";
}

function FetchRequestResults({ data }: FetchRequestResultsProps) {
  if (!data || data.length === 0) {
    return <p>No data available.</p>;
  }

  const maxLengthForDescription = 100;

  return (
    <div className={styles.container}>
      <table>
        <thead>
          <tr>
            {Object.keys(data[0]).map((key) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              {Object.entries(item).map(([key, value], innerIndex) => (
                <td key={innerIndex}>
                  {key === "description"
                    ? truncateDescription(value, maxLengthForDescription)
                    : value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FetchRequestResults;
