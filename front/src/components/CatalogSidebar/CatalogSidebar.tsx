import { useEffect, useState } from "react";
import styles from "./CatalogSidebar.module.css";
import { useLocation } from "react-router-dom";

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
  const [filters, setFilters] = useState<Filters>();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const publisherParam = queryParams.get("publisher");
  const genreParam = queryParams.get("genre");
  const authorParam = queryParams.get("author");
  const languageParam = queryParams.get("language");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responsePublisher = await fetch(
          "http://localhost:8080/publisher"
        );
        const dataPublisher = await responsePublisher.json();
        const responseLanguage = await fetch("http://localhost:8080/language");
        const dataLanguage = await responseLanguage.json();
        const responseGenre = await fetch("http://localhost:8080/genre");
        const dataGenre = await responseGenre.json();
        const responseAuthor = await fetch("http://localhost:8080/author");
        const dataAuthor = await responseAuthor.json();

        const mappedLanguages = dataLanguage.map(
          (language: { name: string }, index: number) => ({
            id: index + 1,
            name: language.name,
          })
        );

        const mappedAuthors = dataAuthor.map(
          (author: { id: number; firstName: string; lastName: string }) => ({
            id: author.id,
            name: author.firstName + " " + author.lastName,
          })
        );

        setFilters({
          publisher: dataPublisher,
          author: mappedAuthors,
          language: mappedLanguages,
          genre: dataGenre,
        });

        const initialSelectedFilters: Filters = {
          publisher: [],
          author: [],
          language: [],
          genre: [],
        };

        for (const [key, value] of queryParams.entries()) {
          const filterType = key.replace(/\[\]$/, "");
          console.log("Filter type:", filterType, "Filter value:", value);
          console.log("Filters:", filters);
          if (filters && filters[filterType as keyof Filters]) {
            console.log("HERE");
            const filterId = parseInt(value);
            const filterItem = filters[filterType as keyof Filters].find(
              (item: FilterItem) => item.id === filterId
            );
            if (filterItem) {
              initialSelectedFilters[filterType as keyof Filters].push(
                filterItem
              );
              console.log("Filter item added:", filterItem);
            } else {
              console.log("No filter item found for ID:", filterId);
            }
          }
        }

        console.log("Initial selected filters:", initialSelectedFilters);
        setSelectedFilters(initialSelectedFilters);
        applyFilters();
      } catch (error) {
        console.error("Error fetching filter data:", error);
      }
    };

    fetchData();
  }, []);

  const [selectedFilters, setSelectedFilters] = useState<Filters>({
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
        {filters &&
          Object.entries(filters).map(([filterType, filterItems]) => (
            <div key={filterType} className={styles.filters}>
              <p className={styles.filterName}>{filterType}</p>
              <div className={styles.filtersContainer}>
                {filterItems.map((filterItem: FilterItem) => (
                  <div key={filterItem.id} className={styles.filter}>
                    <input
                      type="checkbox"
                      id={`${filterType}-${filterItem.id}`}
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
      <div className={styles.buttonContainer}>
        <button onClick={applyFilters} className={styles.applyFiltersButton}>
          Apply Filters
        </button>
      </div>
    </div>
  );
}

export default CatalogSidebar;
