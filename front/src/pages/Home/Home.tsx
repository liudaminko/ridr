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
  const newBooks = [
    {
      id: 1,
      imageUrl: "9780452284234.jpeg",
      authors: "George Orwell",
      title: "1984",
      price: 10,
      liked: false,
    },
    {
      id: 2,
      imageUrl: "9780060935467.jpeg",
      authors: "Harper Lee",
      title: "To Kill a Mockingbird",
      price: 8,
      liked: false,
    },
    {
      id: 3,
      imageUrl: "9780606170970.jpeg",
      authors: "J.K. Rowling",
      title: "Harry Potter and the Philosopher’s Stone",
      price: 15,
      liked: false,
    },
    {
      id: 4,
      imageUrl: "9780140434262.jpeg",
      authors: "Jane Austen",
      title: "Pride and Prejudice",
      price: 6,
      liked: false,
    },
    {
      id: 5,
      imageUrl: "9780156012072.jpeg",
      authors: "Antoine de Saint-Exupéry",
      title: "The Little Prince",
      price: 5,
      liked: false,
    },
    {
      id: 6,
      imageUrl: "9780142437209.jpeg",
      authors: "Charlotte Brontë",
      title: "Jane Eyre",
      price: 10,
      liked: false,
    },
    {
      id: 7,
      imageUrl: "9780375831003.jpeg",
      authors: "Markus Zusak",
      title: "The Book Thief",
      price: 10,
      liked: false,
    },
    {
      id: 8,
      imageUrl: "",
      authors: "J.R.R. Tolkien",
      title: "The Lord of the Rings",
      price: 10,
      liked: false,
    },
    {
      id: 9,
      imageUrl: "",
      authors: "J.D. Salinger",
      title: "The Catcher in the Rye",
      price: 10,
      liked: false,
    },
    {
      id: 10,
      imageUrl: "",
      authors: "F. Scott Fitzgerald",
      title: "The Great Gatsby",
      price: 12,
      liked: false,
    },
  ];

  const [lastMonthPopularBooks, setLastMonthPopularBooks] = useState<Book[]>(
    []
  );

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/catalog/popularmonth?userId=${userId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        setLastMonthPopularBooks(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserInfo();
  }, [userId]);

  return (
    <div className={styles.container}>
      <CategoryProposal />
      <div className={styles.mainContent}>
        <SideBar />
        <Slide />
      </div>

      <BooksSuggestions
        books={newBooks}
        title="New books"
        backgroundColor="#FFFFFF"
        categoryBackgroundColor="#e3502e"
      />
      <BooksSuggestions
        books={lastMonthPopularBooks}
        title="Month's bestsellers"
        backgroundColor="transparent"
        categoryBackgroundColor="#a4ae9d"
      />
    </div>
  );
}

export default Home;
