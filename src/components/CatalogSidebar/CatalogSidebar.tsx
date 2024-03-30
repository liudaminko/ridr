import { useEffect, useState } from "react";
import styles from "./CatalogSidebar.module.css";

export interface FilterItem {
  id: number;
  name: string;
}

interface Filters {
  publisher: FilterItem[];
  author: FilterItem[];
  language: FilterItem[];
  genre: FilterItem[];
}

interface CatalogSidebarProps {
  onFiltersChange: (filters: Filters) => void;
  onFilterRemove: (filterType: keyof Filters, filterId: number) => void;
}

function CatalogSidebar({
  onFiltersChange,
  onFilterRemove,
}: CatalogSidebarProps) {
  const filters = {
    publisher: [
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
    author: [
      {
        id: 1,
        name: "George Orwell",
      },
      {
        id: 2,
        name: "Allan Pou",
      },
    ],
    language: [
      {
        id: 1,
        name: "English",
      },
      {
        id: 2,
        name: "Spanish",
      },
    ],
    genre: [
      {
        id: 1,
        name: "horror",
      },
      {
        id: 2,
        name: "romance",
      },
      {
        id: 3,
        name: "history",
      },
      {
        id: 4,
        name: "poetry",
      },
      {
        id: 5,
        name: "science fiction",
      },
      {
        id: 6,
        name: "biography",
      },
    ],
  };
  const [selectedFilters, setSelectedFilters] = useState({
    publisher: [],
    author: [],
    language: [],
    genre: [],
  });

  const handleFilterChange = (
    filterType: string,
    filterId: number,
    filterName: string,
    checked: boolean
  ) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [filterType as keyof Filters]: checked
        ? [
            ...(prevFilters[filterType as keyof Filters] || []),
            { id: filterId, name: filterName },
          ]
        : (prevFilters[filterType as keyof Filters] || []).filter(
            (filter: FilterItem) => filter.id !== filterId
          ),
    }));
  };

  const applyFilters = () => {
    onFiltersChange(selectedFilters);
  };

  return (
    <div className={styles.container}>
      <h3>Filters</h3>
      <div className={styles.filterContainer}>
        {Object.entries(filters).map(([filterType, filterItems]) => (
          <div key={filterType} className={styles.filters}>
            <p className={styles.filterName}>{filterType}</p>
            <div className={styles.filtersContainer}>
              {filterItems.map((filterItem: FilterItem) => (
                <div key={filterItem.id} className={styles.filter}>
                  <input
                    type="checkbox"
                    id={`${filterType}-${filterItem.id}`} // Prefix the id with filterType
                    name={filterType}
                    className={styles.checkbox}
                    onChange={(e) =>
                      handleFilterChange(
                        filterType,
                        filterItem.id,
                        filterItem.name,
                        e.target.checked
                      )
                    }
                  />
                  <label htmlFor={`${filterType}-${filterItem.id}`}>
                    {filterItem.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button onClick={applyFilters}>Apply Filters</button>
    </div>
  );
}

export default CatalogSidebar;
