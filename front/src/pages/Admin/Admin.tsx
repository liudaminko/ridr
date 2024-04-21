import styles from "./Admin.module.css";
import EntityEditor from "../../components/EntityEditor/EntityEditor";

function Admin() {
  const publisherFields = [
    {
      name: "name",
      label: "Name",
      type: "text",
      value: "",
      onChange: () => {},
    },
    {
      name: "address",
      label: "Address",
      type: "text",
      value: "",
      onChange: () => {},
    },
  ];

  const genreFields = [
    {
      name: "name",
      label: "Name",
      type: "text",
      value: "",
      onChange: () => {},
    },
  ];

  const authorFields = [
    {
      name: "firstName",
      label: "First name",
      type: "text",
      value: "",
      onChange: () => {},
    },
    {
      name: "lastName",
      label: "Last name",
      type: "text",
      value: "",
      onChange: () => {},
    },
    {
      name: "biography",
      label: "Biography",
      type: "text",
      value: "",
      onChange: () => {},
    },
  ];

  const bookFields = [
    {
      name: "title",
      label: "Title",
      type: "text",
      value: "",
      onChange: () => {},
    },
    {
      name: "description",
      label: "Description",
      type: "text",
      value: "",
      onChange: () => {},
    },
    {
      name: "genre",
      label: "Genre",
      type: "text",
      value: "",
      onChange: () => {},
    },
    {
      name: "publisher",
      label: "Publisher",
      type: "text",
      value: "",
      onChange: () => {},
    },
    {
      name: "publishingYear",
      label: "Publishing year",
      type: "text",
      value: "",
      onChange: () => {},
    },
    {
      name: "pages",
      label: "Pages",
      type: "text",
      value: "",
      onChange: () => {},
    },
    {
      name: "isbn",
      label: "ISBN",
      type: "text",
      value: "",
      onChange: () => {},
    },
    {
      name: "language",
      label: "Language (3 letters)",
      type: "text",
      value: "",
      onChange: () => {},
    },
    {
      name: "imageUrl",
      label: "Image URL",
      type: "text",
      value: "",
      onChange: () => {},
    },
    {
      name: "price",
      label: "Price",
      type: "text",
      value: "",
      onChange: () => {},
    },
  ];

  const bookAuthorsFields = [
    {
      name: "author",
      label: "Author's full name",
      type: "text",
      value: "",
      onChange: () => {},
    },
    {
      name: "book",
      label: "Book's title",
      type: "text",
      value: "",
      onChange: () => {},
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Admin Dashboard</h1>
        <img src="/admin.png" style={{ height: "40px" }} alt="Admin" />
      </div>
      <div className={styles.entitiesContainer}>
        <EntityEditor title="Publisher" fields={publisherFields} />
        <EntityEditor title="Genre" fields={genreFields} />
        <EntityEditor title="Author" fields={authorFields} />
        <EntityEditor title="Book" fields={bookFields} />
        <EntityEditor title="Book's Authors" fields={bookAuthorsFields} />
      </div>
    </div>
  );
}

export default Admin;
