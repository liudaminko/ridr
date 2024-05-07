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

  const publisherParam = queryParams.getAll("publisher");
  const genreParam = queryParams.getAll("genre");
  const authorParam = queryParams.getAll("author");
  const languageParam = queryParams.getAll("language");

  // Convert filter values to FilterItem arrays
  const publisherFilters: FilterItem[] = publisherParam.map((id) => ({
    id: parseInt(id),
    name: "publisher",
  }));
  const genreFilters: FilterItem[] = genreParam.map((id) => ({
    id: parseInt(id),
    name: "genre",
  }));
  const authorFilters: FilterItem[] = authorParam.map((id) => ({
    id: parseInt(id),
    name: "author",
  }));
  const languageFilters: FilterItem[] = languageParam.map((id) => ({
    id: parseInt(id),
    name: "language",
  }));

  const [selectedFilters, setSelectedFilters] = useState<Filters>({
    publisher: [],
    genre: [],
    author: [],
    language: [],
  });

  const [books, setBooks] = useState<Book[]>([]);
  const [booksTotal, setBooksTotal] = useState(0);

  const [booksToShow, setBooksToShow] = useState<number>(20);
  const [currentPage, setCurrentPage] = useState<number>(1); // Current page number
  const [totalPages, setTotalPages] = useState<number>(1);

  const navigate = useNavigate();

  const [userId, setUserId] = useState<string | null>(
    localStorage.getItem("userId")
  );

  useEffect(() => {
    fetchBooksCount();
    setTotalPages(Math.ceil(booksTotal / booksToShow));
    fetchBooks();
    console.log("books count", booksTotal);

    console.log("pages", totalPages);
  }, [booksToShow, selectedFilters]);

  const buildFiltersUrl = (filters: Filters, baseUrl: string): string => {
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([filterType, filterItems]) => {
      if (filterItems && filterItems.length > 0) {
        if (filterItems.length > 1) {
          const filterValues = filterItems
            .map((item) => {
              if (filterType === "language") {
                return `'${item.id}'`;
              }
              return item.id;
            })
            .join(",");
          queryParams.append(filterType, filterValues);
        } else {
          if (filterType === "language") {
            queryParams.append(filterType, `'${filterItems[0].id}'`); // Enclose language value in single quotes
          } else {
            queryParams.append(filterType, String(filterItems[0].id));
          }
        }
      }
    });
    let url = "";
    if (queryParams.toString() !== "") {
      url = `/filters?${queryParams.toString()}`;
    }

    return url;
  };

  const fetchBooks = async () => {
    const offset = (currentPage - 1) * booksToShow;
    try {
      console.log("page", currentPage, "offset", offset);
      const baseUrl = "http://localhost:8080/book";
      let url = baseUrl;

      if (userId) {
        url += `/authorized`;
      } else {
        url += "/nonauthorized";
      }

      const anyFiltersSelected = Object.values(selectedFilters).some(
        (filterArray) => filterArray.length > 0
      );
      console.log("Any filters selected:", anyFiltersSelected);

      if (anyFiltersSelected) {
        const filtersUrl = buildFiltersUrl(selectedFilters, baseUrl);
        url += filtersUrl;
        url += `&userId=${userId}&limit=${booksToShow}&offset=${offset}`;
      } else {
        url += `?limit=${booksToShow}&offset=${offset}&userId=${userId}`;
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

  const fetchBooksCount = async () => {
    try {
      let url = "http://localhost:8080/book/count";

      console.log(url);
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setBooksTotal(data);
        console.log(data);
      } else {
        console.error("Failed to fetch books:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchBooks();
  };

  const paginationButtons = [];
  const maxButtonsToShow = 6;

  let startPage = Math.max(1, currentPage - Math.floor(maxButtonsToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxButtonsToShow - 1);

  if (endPage - startPage + 1 < maxButtonsToShow) {
    startPage = Math.max(1, endPage - maxButtonsToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    paginationButtons.push(
      <button
        key={i}
        onClick={() => handlePageChange(i)}
        className={`${styles.page} ${
          currentPage === i ? styles.activePage : ""
        }`}
      >
        {i}
      </button>
    );
  }

  const handleFiltersChange = (filters: Filters) => {
    setSelectedFilters(filters);
    const queryParams = new URLSearchParams(location.search);

    Object.entries(filters).forEach(([filterType, filterItems]) =>
      filterItems.forEach((filterItem: FilterItem) =>
        queryParams.append(filterType, String(filterItem.id))
      )
    );
    console.log("FILTERS CHANGED");

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
    handleFilterRemove(filterType, filterId);
  };

  const handleFilterRemove = (filterType: keyof Filters, filterId: number) => {
    console.log("FUCK U");
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: prevFilters[filterType].filter(
        (filter) => filter.id !== filterId
      ),
    }));
    handleFiltersChange(selectedFilters);

    const queryParams = new URLSearchParams(location.search);
    queryParams.delete(filterType);
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: prevFilters[filterType].filter(
        (filter) => filter.id !== filterId
      ),
    }));
    navigate(`?${queryParams.toString()}`);
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
        <div className={styles.pagination}>
          {currentPage > 1 && (
            <button onClick={() => handlePageChange(currentPage - 1)}>
              Prev
            </button>
          )}
          {paginationButtons}
          {currentPage < totalPages && (
            <button onClick={() => handlePageChange(currentPage + 1)}>
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Catalog;
