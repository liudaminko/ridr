import styles from "./Catalog.module.css";
import CatalogSidebar from "../../components/CatalogSidebar/CatalogSidebar";
import Book from "../../components/Book/Book";
import SortingDropdown from "../../components/SortingDropdown/SortingDropdown";
import { useEffect, useState } from "react";
import { FilterItem } from "../../components/CatalogSidebar/CatalogSidebar";
import { useLocation, useNavigate } from "react-router-dom";

interface Filters {
  publisher: FilterItem[];
  author: FilterItem[];
  language: FilterItem[];
  genre: FilterItem[];
}

export interface Book {
  id: number;
  title: string;
  price: number;
  authors: string;
  imageUrl: string;
  liked: boolean;
}

function Catalog() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const publisherParam = queryParams.get("publisher");
  const genreParam = queryParams.get("genre");
  const authorParam = queryParams.get("author");
  const languageParam = queryParams.get("language");

  const [books, setBooks] = useState<Book[]>([]);
  const [booksToShow, setBooksToShow] = useState<number>(20);
  const [offset, setOffset] = useState<number>(0);

  const navigate = useNavigate();

  const [userId, setUserId] = useState<string | null>(
    localStorage.getItem("userId")
  );
  const [selectedFilters, setSelectedFilters] = useState<Filters>(
    {} as Filters
  );

  useEffect(() => {
    fetchBooks();
  }, [booksToShow, offset, selectedFilters]);

  const fetchBooks = async () => {
    try {
      let baseFetchUrl = "http://localhost:8080/book";
      let url = `${baseFetchUrl}?limit=${booksToShow}&offset=${offset}`;

      if (genreParam) {
        url += `&genre=${genreParam}`;
      }
      if (publisherParam) {
        url += `&publisher=${publisherParam}`;
      }
      if (authorParam) {
        url += `&author=${authorParam}`;
      }
      if (languageParam) {
        url += `&language=${languageParam}`;
      }

      // Append authorization parameters if userId is present
      if (userId) {
        url = `${baseFetchUrl}/authorized?limit=${booksToShow}&offset=${offset}&userId=${userId}`;
        if (genreParam) {
          url += `&genre=${genreParam}`;
        }
        if (publisherParam) {
          url += `&publisher=${publisherParam}`;
        }
        if (authorParam) {
          url += `&author=${authorParam}`;
        }
        if (languageParam) {
          url += `&language=${languageParam}`;
        }
      }

      console.log(url);
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setBooks(data);
        console.log(data);
      } else {
        console.error("Failed to fetch books:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const handleLoadMoreClick = () => {
    setOffset((prevOffset) => prevOffset + booksToShow);
    setBooksToShow((prevBooksToShow) => prevBooksToShow + 20);
  };

  const handleFiltersChange = (filters: Filters) => {
    setSelectedFilters(filters);
    const queryParams = new URLSearchParams(location.search);

    Object.entries(filters).forEach(([filterType, filterItems]) =>
      filterItems.forEach((filterItem: FilterItem) =>
        queryParams.append(filterType, String(filterItem.id))
      )
    );
    console.log("FILTERS CHANGED");

    // Update the URL
    navigate({ search: queryParams.toString() });

    console.log(filters);
  };

  const handleSortChange = (option: string) => {
    console.log("Sorting by", option);
  };
  const handleFilterClick = (filterType: keyof Filters, filterId: number) => {
    if (Object.keys(selectedFilters).includes(filterType)) {
      setSelectedFilters((prevFilters) => ({
        ...prevFilters,
        [filterType]: prevFilters[filterType].filter(
          (filter) => filter.id !== filterId
        ),
      }));
    }

    const checkboxId = `${filterType}-${filterId}`;
    const checkbox = document.getElementById(checkboxId) as HTMLInputElement;
    if (checkbox) {
      checkbox.checked = false;
    }
  };

  const handleFilterRemove = (filterType: keyof Filters, filterId: number) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: prevFilters[filterType].filter(
        (filter) => filter.id !== filterId
      ),
    }));
    handleFiltersChange(selectedFilters);
  };

  return (
    <div className={styles.container}>
      <CatalogSidebar
        onFiltersChange={handleFiltersChange}
        onFilterRemove={handleFilterRemove}
      />
      <div className={styles.catalogContainer}>
        <div className={styles.header}>
          <div className={styles.filtersContainer}>
            {Object.entries(selectedFilters).map(([filterType, filterItems]) =>
              filterItems.map((filterItem: FilterItem) => (
                <div
                  className={styles.filter}
                  key={`${filterType}-${filterItem.id}`}
                  onClick={() =>
                    handleFilterClick(
                      filterType as keyof Filters,
                      filterItem.id
                    )
                  }
                >
                  <p className={styles.filterCircle}>{filterItem.name}</p>
                  <img src="/close_white_1.png" alt="close" height={"10px"} />
                </div>
              ))
            )}
          </div>
          <SortingDropdown onSortChange={handleSortChange} />
        </div>
        <div className={styles.booksContainer}>
          {books.map((book) => (
            <Book
              key={book.id}
              id={book.id}
              title={book.title}
              price={book.price}
              authors={book.authors}
              imageUrl={book.imageUrl}
              liked={book.liked}
              width="22%"
            />
          ))}
        </div>
        <button onClick={handleLoadMoreClick}>load more</button>
      </div>
    </div>
  );
}

export default Catalog;
