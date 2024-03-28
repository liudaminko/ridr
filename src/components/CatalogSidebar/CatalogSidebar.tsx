import styles from "./CatalogSidebar.module.css";

function CatalogSidebar() {
  const filters = {
    publishers: [
      {
        id: 1,
        name: "Penguin",
      },
      {
        id: 2,
        name: "Meredian Chernowitz",
      },
      {
        id: 3,
        name: "Random House",
      },
      {
        id: 4,
        name: "Hodder",
      },
      {
        id: 5,
        name: "Bloomsburry",
      },
      {
        id: 6,
        name: "Видавництво Старого Лева",
      },
      {
        id: 7,
        name: "HarperCollins Publishers",
      },
      {
        id: 8,
        name: "Meredian Chernowitz",
      },
      {
        id: 9,
        name: "Random House",
      },
      {
        id: 10,
        name: "Penguin",
      },
      {
        id: 11,
        name: "Meredian Chernowitz",
      },
      {
        id: 12,
        name: "Random House",
      },
    ],
    authors: [
      {
        id: 1,
        name: "George Orwell",
      },
      {
        id: 2,
        name: "Allan Pou",
      },
    ],
    languages: [
      {
        id: 1,
        name: "English",
      },
      {
        id: 2,
        name: "Spanish",
      },
    ],
  };

  return (
    <div className={styles.container}>
      <h3>Filters</h3>
      <div className={styles.filterContainer}>
        {Object.entries(filters).map(([filterType, filterItems]) => (
          <div key={filterType} className={styles.filters}>
            <p className={styles.filterName}>{filterType}</p>
            <div className={styles.filtersContainer}>
              {filterItems.map((filterItem) => (
                <div key={filterItem.id} className={styles.filter}>
                  <input
                    type="checkbox"
                    id={filterItem.id.toString()}
                    name={filterType}
                    className={styles.checkbox}
                  />
                  <label htmlFor={filterItem.id.toString()}>
                    {filterItem.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CatalogSidebar;
