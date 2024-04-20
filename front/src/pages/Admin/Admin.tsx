import styles from "./Admin.module.css";
import { useEffect, useState } from "react";

const Admin = () => {
  const [publishers, setPublishers] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  const [isOpen, setIsOpen] = useState<{ [key: string]: boolean }>({
    Publisher: false,
    Genre: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const publishersResponse = await fetch("/api/publishers", { headers });
        const publishersData = await publishersResponse.json();
        setPublishers(publishersData);

        const genresResponse = await fetch("/api/genres", { headers });
        const genresData = await genresResponse.json();
        setGenres(genresData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setSelectedAction(null);
    setIsOpen((prevState) => ({
      ...prevState,
      [option]: !prevState[option],
    }));
  };

  const handleActionSelect = (action: string) => {
    setSelectedAction(action);
  };

  return (
    <div className={styles.container}>
      <h2>Admin Dashboard</h2>
      <div
        className={styles.tableContainer}
        onClick={() => handleOptionSelect("Publisher")}
      >
        <h3>Publishers</h3>
        <img
          src={isOpen.Publisher ? "/opened.png" : "/closed.png"}
          alt={isOpen.Publisher ? "open" : "closed"}
          style={{ height: "24px" }}
        />
        {isOpen.Publisher && (
          <div>
            <div>
              <button onClick={() => handleActionSelect("add")}>Add</button>
              <button onClick={() => handleActionSelect("change")}>
                Change
              </button>
              <button onClick={() => handleActionSelect("delete")}>
                Delete
              </button>
            </div>
            {selectedAction === "add" && (
              <div>
                <label>
                  <input type="text" />
                  title
                </label>
              </div>
            )}
            {selectedAction === "delete" && (
              <div>
                <label>
                  <input type="text" />
                  isbn
                </label>
              </div>
            )}
          </div>
        )}
      </div>
      <div
        className={styles.tableContainer}
        onClick={() => handleOptionSelect("Genre")}
      >
        <h3>Genres</h3>
        <img
          src={isOpen.Genre ? "/opened.png" : "/closed.png"}
          alt={isOpen.Genre ? "open" : "closed"}
          style={{ height: "24px" }}
        />
      </div>
    </div>
  );
};

export default Admin;
