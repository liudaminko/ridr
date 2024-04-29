import React, { useEffect, useState } from "react";
import styles from "./Admin.module.css";
import EntityEditor from "../../components/EntityEditor/EntityEditor";
import BookEntityEditor from "../../components/EntityEditor/BookEntityEditor";
import Dashboards from "../../components/Dashboards/Dashboards";
import AdminLogIn from "./AdminLogIn";

function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };
  const [selectedWindow, setSelectedWindow] = useState("entity");
  const [publisherFields, setPublisherFields] = useState([
    {
      id: "name",
      name: "name",
      label: "Name",
      type: "text",
      value: "",
      onChange: (id: string, value: string) =>
        handleFieldChange("publisher", id, value),
    },
    {
      id: "address",
      name: "address",
      label: "Address",
      type: "text",
      value: "",
      onChange: (id: string, value: string) =>
        handleFieldChange("publisher", id, value),
    },
  ]);

  const [genreFields, setGenreFields] = useState([
    {
      id: "name",
      name: "name",
      label: "Name",
      type: "text",
      value: "",
      onChange: (id: string, value: string) =>
        handleFieldChange("genre", id, value),
    },
  ]);

  const [authorFields, setAuthorFields] = useState([
    {
      id: "firstName",
      name: "firstName",
      label: "First name",
      type: "text",
      value: "",
      onChange: (id: string, value: string) =>
        handleFieldChange("author", id, value),
    },
    {
      id: "lastName",
      name: "lastName",
      label: "Last name",
      type: "text",
      value: "",
      onChange: (id: string, value: string) =>
        handleFieldChange("author", id, value),
    },
    {
      id: "biography",
      name: "biography",
      label: "Biography",
      type: "text",
      value: "",
      onChange: (id: string, value: string) =>
        handleFieldChange("author", id, value),
    },
  ]);

  const [bookFields, setBookFields] = useState([
    {
      id: "title",
      name: "title",
      label: "Title",
      type: "text",
      value: "",
      onChange: (id: string, value: string) =>
        handleFieldChange("book", id, value),
    },
    {
      id: "description",
      name: "description",
      label: "Description",
      type: "text",
      value: "",
      onChange: (id: string, value: string) =>
        handleFieldChange("book", id, value),
    },
    {
      id: "genre",
      name: "genre",
      label: "Genre",
      type: "select", // Change type to "select" for select input
      value: "", // Initial value
      options: [], // Options for genre select, will be populated later
      onChange: (id: string, value: string) =>
        handleFieldChange("book", id, value),
    },
    {
      id: "publisher", // ID for publisher field
      name: "publisher",
      label: "Publisher",
      type: "select", // Change type to "select" for select input
      value: "", // Initial value
      options: [], // Options for publisher select, will be populated later
      onChange: (id: string, value: string) =>
        handleFieldChange("book", id, value),
    },
    {
      id: "publicationYear",
      name: "publicationYear",
      label: "Publication year",
      type: "text",
      value: "",
      onChange: (id: string, value: string) =>
        handleFieldChange("book", id, value),
    },
    {
      id: "pages",
      name: "pages",
      label: "Pages",
      type: "text",
      value: "",
      onChange: (id: string, value: string) =>
        handleFieldChange("book", id, value),
    },
    {
      id: "isbn",
      name: "isbn",
      label: "ISBN",
      type: "text",
      value: "",
      onChange: (id: string, value: string) =>
        handleFieldChange("book", id, value),
    },
    {
      id: "language",
      name: "language",
      label: "Language (3 letters)",
      type: "text",
      value: "",
      onChange: (id: string, value: string) =>
        handleFieldChange("book", id, value),
    },
    {
      id: "imageUrl",
      name: "imageUrl",
      label: "Image URL",
      type: "text",
      value: "",
      onChange: (id: string, value: string) =>
        handleFieldChange("book", id, value),
    },
    {
      id: "price",
      name: "price",
      label: "Price",
      type: "text",
      value: "",
      onChange: (id: string, value: string) =>
        handleFieldChange("book", id, value),
    },
  ]);

  const [bookAuthorsFields, setBookAuthorsFields] = useState([
    {
      id: "author",
      name: "author",
      label: "Author's full name",
      type: "text",
      value: "",
      onChange: (id: string, value: string) =>
        handleFieldChange("bookauthors", id, value),
    },
    {
      id: "book",
      name: "book",
      label: "Book's title",
      type: "text",
      value: "",
      onChange: (id: string, value: string) =>
        handleFieldChange("bookauthors", id, value),
    },
  ]);

  function handleFieldChange(fieldType: string, id: string, value: string) {
    switch (fieldType) {
      case "publisher":
        setPublisherFields((prevFields) =>
          prevFields.map((field) =>
            field.id === id ? { ...field, value } : field
          )
        );
        break;
      case "genre":
        setGenreFields((prevFields) =>
          prevFields.map((field) =>
            field.id === id ? { ...field, value } : field
          )
        );
        break;
      case "author":
        setAuthorFields((prevFields) =>
          prevFields.map((field) =>
            field.id === id ? { ...field, value } : field
          )
        );
        break;
      case "book":
        setBookFields((prevFields) =>
          prevFields.map((field) =>
            field.id === id ? { ...field, value } : field
          )
        );
        break;
      case "bookauthors":
        setBookAuthorsFields((prevFields) =>
          prevFields.map((field) =>
            field.id === id ? { ...field, value } : field
          )
        );
        break;
    }
  }

  const publisherFilterNames = {
    name: "Name",
    address: "Address",
  };
  const genreFilterNames = {
    name: "Name",
  };
  const authorFilterNames = {
    fullName: "Full Name",
  };
  const bookFilterNames = {
    title: "Title",
    genre: "Genre",
    publisher: "Publisher",
    publishingYear: "Publishing Year",
    isbn: "ISBN",
    language: "Language (3 letters)",
    price: "Price",
  };
  const bookAuthorsFilterNames = {
    author: "Author's full name",
    book: "Book's title",
  };

  const [publisherDeleteField, setPublisherDeleteField] = useState([
    {
      id: "publisherName",
      name: "name",
      label: "name",
      type: "text",
      value: "",
      options: [],
      onChange: (id: string, value: string) =>
        handleDeleteFieldChange("publisher", id, value),
    },
  ]);
  const [genreDeleteField, setGenreDeleteField] = useState([
    {
      id: "genreName",
      name: "name",
      label: "name",
      type: "text",
      value: "",
      options: [],
      onChange: (id: string, value: string) =>
        handleDeleteFieldChange("genre", id, value),
    },
  ]);
  const [authorDeleteField, setAuthorDeleteField] = useState([
    {
      id: "authorFullName",
      name: "fullName",
      label: "full name",
      type: "text",
      value: "",
      onChange: (id: string, value: string) =>
        handleDeleteFieldChange("author", id, value),
    },
  ]);
  const [bookDeleteField, setBookDeleteField] = useState([
    {
      id: "isbn",
      name: "isbn",
      label: "ISBN",
      type: "text",
      value: "",
      onChange: (id: string, value: string) =>
        handleDeleteFieldChange("book", id, value),
    },
  ]);
  const [bookAuthorsDeleteField, setBookAuthorsDeleteField] = useState([
    {
      id: "bookISBN",
      name: "boonIsbn",
      label: "Book's ISBN",
      type: "text",
      value: "",
      onChange: (id: string, value: string) =>
        handleDeleteFieldChange("bookauthors", id, value),
    },
  ]);

  const handleEditInputChange = async (entity: string, value: string) => {
    try {
      const response = await fetch(
        `http://localhost:8080/${entity.toLowerCase()}?name=${value}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch names");
      }
      const data = await response.json();
      const options = data.map((item: any) => ({
        id: item.id,
        name: item.name,
      }));
      console.log(options);
      switch (entity) {
        case "publisher":
          setPublisherDeleteField((prevFields) =>
            prevFields.map((field) =>
              field.id === "publisherName" ? { ...field, options } : field
            )
          );
          break;
        case "genre":
          setGenreDeleteField((prevFields) =>
            prevFields.map((field) =>
              field.id === "genreName" ? { ...field, options } : field
            )
          );
          break;
        default:
          console.error("Invalid entity type:", entity);
      }
    } catch (error) {
      console.error("Error fetching names:", error);
    }
  };

  function handleDeleteFieldChange(
    fieldType: string,
    id: string,
    value: string
  ) {
    console.log("received input change for", fieldType);
    switch (fieldType) {
      case "publisher":
        setPublisherDeleteField((prevFields) =>
          prevFields.map((field) =>
            field.id === id ? { ...field, value } : field
          )
        );
        handleEditInputChange(fieldType, value);
        break;
      case "genre":
        setGenreDeleteField((prevFields) =>
          prevFields.map((field) =>
            field.id === id ? { ...field, value } : field
          )
        );
        handleEditInputChange(fieldType, value);
        break;
      case "author":
        setAuthorDeleteField((prevFields) =>
          prevFields.map((field) =>
            field.id === id ? { ...field, value } : field
          )
        );
        break;
      case "bookAuthors":
        setBookAuthorsDeleteField((prevFields) =>
          prevFields.map((field) =>
            field.id === id ? { ...field, value } : field
          )
        );
        break;
      case "book":
        setBookDeleteField((prevFields) =>
          prevFields.map((field) =>
            field.id === id ? { ...field, value } : field
          )
        );
        break;
      default:
        console.error("Invalid field type:", fieldType);
    }
  }

  return (
    <div>
      {!isLoggedIn ? (
        <AdminLogIn onLogin={handleLogin} />
      ) : (
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Admin Dashboard</h1>
            <img src="/admin.png" style={{ height: "40px" }} alt="Admin" />
          </div>
          <div className={styles.windowsChanger}>
            <button
              onClick={() => setSelectedWindow("entity")}
              className={`${styles.action} ${
                selectedWindow === "entity" ? styles.selected : ""
              }`}
            >
              Book Editor
            </button>
            <button
              onClick={() => setSelectedWindow("dash")}
              className={`${styles.action} ${
                selectedWindow === "dash" ? styles.selected : ""
              }`}
            >
              Dashboards
            </button>
          </div>
          {selectedWindow === "entity" ? (
            <div className={styles.entitiesContainer}>
              <EntityEditor
                title="Publisher"
                fields={publisherFields}
                filters={publisherFilterNames}
                deleteField={publisherDeleteField}
                handleEditInputChange={handleEditInputChange}
                setFields={setPublisherFields}
              />
              <EntityEditor
                title="Genre"
                fields={genreFields}
                filters={genreFilterNames}
                deleteField={genreDeleteField}
                handleEditInputChange={handleEditInputChange}
                setFields={setGenreFields}
              />
              <EntityEditor
                title="Author"
                fields={authorFields}
                filters={authorFilterNames}
                deleteField={authorDeleteField}
                handleEditInputChange={handleEditInputChange}
                setFields={setAuthorFields}
              />
              <BookEntityEditor
                title="Book"
                fields={bookFields}
                filters={bookFilterNames}
                deleteField={bookDeleteField}
              />
              <EntityEditor
                title="Book's Authors"
                fields={bookAuthorsFields}
                filters={bookAuthorsFilterNames}
                deleteField={bookAuthorsDeleteField}
                handleEditInputChange={handleEditInputChange}
                setFields={setBookAuthorsFields}
              />
            </div>
          ) : (
            <Dashboards />
          )}
        </div>
      )}
    </div>
  );
}

export default Admin;
