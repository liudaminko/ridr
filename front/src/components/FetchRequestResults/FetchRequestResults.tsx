import styles from "./FetchRequestResults.module.css";

interface DataItem {
  [key: string]: any;
}

interface FetchRequestResultsProps {
  data: DataItem[];
}

function FetchRequestResults({ data }: FetchRequestResultsProps) {
  if (!data || data.length === 0) {
    return <p>No data available.</p>;
  }

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
              {Object.values(item).map((value, innerIndex) => (
                <td key={innerIndex}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FetchRequestResults;
