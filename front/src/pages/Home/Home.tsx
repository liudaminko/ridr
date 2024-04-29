import styles from "./Home.module.css";
import CategoryProposal from "../../components/CategoryProposal/CategoryProposal";
import SideBar from "../../components/Sidebar/SideBar";
import Slide from "../../components/Slide/Slide";
import BooksSuggestions from "../../components/BooksSuggestions/BooksSuggestions";
import { useEffect, useState } from "react";
import { Book } from "../Catalog/Catalog";

function Home() {
  const [userId, setUserId] = useState<string | null>(
    localStorage.getItem("userId")
  );
  const [newBooks, setNewBooks] = useState<Book[]>([]);

  const [lastMonthPopularBooks, setLastMonthPopularBooks] = useState<Book[]>(
    []
  );

  useEffect(() => {
    const fetchPopularBoooks = async () => {
      try {
        let url;
        if (userId) {
          url = `http://localhost:8080/book/popularmonth?userId=${userId}`;
        } else {
          url = `http://localhost:8080/book/popularmonth/nonauthorized`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        setLastMonthPopularBooks(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    const fetchNewBoooks = async () => {
      try {
        let url;
        if (userId) {
          url = `http://localhost:8080/book/new?userId=${userId}`;
        } else {
          url = `http://localhost:8080/book/new/nonauthorized`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        setNewBooks(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchPopularBoooks();

    fetchNewBoooks();
  }, [userId]);

  return (
    <div className={styles.container}>
      <CategoryProposal />
      <div className={styles.mainContent}>
        <SideBar />
        <Slide />
      </div>
      {newBooks.length > 0 && (
        <BooksSuggestions
          books={newBooks}
          title="New books"
          backgroundColor="#FFFFFF"
          categoryBackgroundColor="#e3502e"
        />
      )}
      {lastMonthPopularBooks.length > 0 && (
        <BooksSuggestions
          books={lastMonthPopularBooks}
          title="Month's bestsellers"
          backgroundColor="transparent"
          categoryBackgroundColor="#a4ae9d"
        />
      )}
    </div>
  );
}

export default Home;
