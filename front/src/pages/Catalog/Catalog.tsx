import styles from "./Catalog.module.css";
import CatalogSidebar from "../../components/CatalogSidebar/CatalogSidebar";
import Book from "../../components/Book/Book";
import SortingDropdown from "../../components/SortingDropdown/SortingDropdown";
import { useState } from "react";
import { FilterItem } from "../../components/CatalogSidebar/CatalogSidebar";

interface Filters {
  publisher: FilterItem[];
  author: FilterItem[];
  language: FilterItem[];
  genre: FilterItem[];
}

function Catalog() {
  const books = [
    {
      id: 1,
      image_url: "9780452284234.jpeg",
      authors: "George Orwell",
      title: "1984",
      price: 10,
      liked: false,
    },
    {
      id: 2,
      image_url: "9780060935467.jpeg",
      authors: "Harper Lee",
      title: "To Kill a Mockingbird",
      price: 8,
      liked: false,
    },
    {
      id: 3,
      image_url: "9780606170970.jpeg",
      authors: "J.K. Rowling",
      title: "Harry Potter and the Philosopher’s Stone",
      price: 15,
      liked: false,
    },
    {
      id: 4,
      image_url: "9780140434262.jpeg",
      authors: "Jane Austen",
      title: "Pride and Prejudice",
      price: 6,
      liked: false,
    },
    {
      id: 5,
      image_url: "9780156012072.jpeg",
      authors: "Antoine de Saint-Exupéry",
      title: "The Little Prince",
      price: 5,
      liked: false,
    },
    {
      id: 6,
      image_url: "9780142437209.jpeg",
      authors: "Charlotte Brontë",
      title: "Jane Eyre",
      price: 10,
      liked: false,
    },
    {
      id: 7,
      image_url: "9780375831003.jpeg",
      authors: "Markus Zusak",
      title: "The Book Thief",
      price: 10,
      liked: false,
    },
    {
      id: 8,
      image_url: "erher",
      authors: "J.R.R. Tolkien",
      title: "The Lord of the Rings",
      price: 10,
      liked: false,
    },
    {
      id: 9,
      image_url: "egr",
      authors: "J.D. Salinger",
      title: "The Catcher in the Rye",
      price: 10,
      liked: false,
    },
    {
      id: 10,
      image_url: "4g",
      authors: "F. Scott Fitzgerald",
      title: "The Great Gatsby",
      price: 12,
      liked: false,
    },
    {
      id: 11,
      title: "The Language of Flowers",
      authors: "Vanessa Diffenbaugh",
      price: 12.99,
      image_url: "https://example.com/language_of_flowers.jpg",
      liked: true,
    },
    {
      id: 12,
      title: "Flower Fairies of the Spring",
      authors: "Cicely Mary Barker",
      price: 10.49,
      image_url: "https://example.com/flower_fairies_spring.jpg",
      liked: false,
    },
    {
      id: 13,
      title: "Flower Arranging for Beginners",
      authors: "Judith Blacklock",
      price: 9.99,
      image_url: "https://example.com/flower_arranging_beginners.jpg",
      liked: true,
    },
    {
      id: 15,
      title: "Flower Power",
      authors: "Lauren Myracle",
      price: 8.99,
      image_url: "https://example.com/flower_power.jpg",
      liked: true,
    },
    {
      id: 16,
      title: "Flower Confidential",
      authors: "Amy Stewart",
      price: 9.99,
      image_url: "https://example.com/flower_confidential.jpg",
      liked: false,
    },
    {
      id: 17,
      title: "The Flower Workshop",
      authors: "Ariella Chezar",
      price: 10.99,
      image_url: "https://example.com/flower_workshop.jpg",
      liked: true,
    },
  ];

  const [selectedFilters, setSelectedFilters] = useState<Filters>(
    {} as Filters
  );

  const handleFiltersChange = (filters: Filters) => {
    setSelectedFilters(filters);
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

    // Uncheck the checkbox when clicking on the filter
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
              imageUrl={book.image_url}
              liked={book.liked}
              width="22%"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Catalog;
