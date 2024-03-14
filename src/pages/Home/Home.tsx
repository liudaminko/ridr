import styles from "./Home.module.css";
import CategoryProposal from "../../components/CategoryProposal/CategoryProposal";
import SideBar from "../../components/Sidebar/SideBar";
import Slide from "../../components/Slide/Slide";
import BooksSuggestions from "../../components/BooksSuggestions/BooksSuggestions";

function Home() {
  const newBooks = [
    {
      id: 1,
      imageUrl: "9780452284234.jpeg",
      authors: "George Orwell",
      title: "1984",
      price: 10,
    },
    {
      id: 2,
      imageUrl: "9780060935467.jpeg",
      authors: "Harper Lee",
      title: "To Kill a Mockingbird",
      price: 8,
    },
    {
      id: 3,
      imageUrl: "9780606170970.jpeg",
      authors: "J.K. Rowling",
      title: "Harry Potter and the Philosopher’s Stone",
      price: 15,
    },
    {
      id: 4,
      imageUrl: "9780140434262.jpeg",
      authors: "Jane Austen",
      title: "Pride and Prejudice",
      price: 6,
    },
    {
      id: 5,
      imageUrl: "9780156012072.jpeg",
      authors: "Antoine de Saint-Exupéry",
      title: "The Little Prince",
      price: 5,
    },
    {
      id: 6,
      imageUrl: "9780142437209.jpeg",
      authors: "Charlotte Brontë",
      title: "Jane Eyre",
      price: 10,
    },
    {
      id: 7,
      imageUrl: "9780375831003.jpeg",
      authors: "Markus Zusak",
      title: "The Book Thief",
      price: 10,
    },
    {
      id: 8,
      imageUrl: "",
      authors: "J.R.R. Tolkien",
      title: "The Lord of the Rings",
      price: 10,
    },
    {
      id: 9,
      imageUrl: "",
      authors: "J.D. Salinger",
      title: "The Catcher in the Rye",
      price: 10,
    },
    {
      id: 10,
      imageUrl: "",
      authors: "F. Scott Fitzgerald",
      title: "The Great Gatsby",
      price: 12,
    },
  ];

  const bestsellers = [
    {
      id: 1,
      imageUrl: "9780452284234.jpeg",
      authors: "George Orwell",
      title: "1984",
      price: 10,
    },
    {
      id: 2,
      imageUrl: "9780060935467.jpeg",
      authors: "Harper Lee",
      title: "To Kill a Mockingbird",
      price: 8,
    },
    {
      id: 3,
      imageUrl: "9780606170970.jpeg",
      authors: "J.K. Rowling",
      title: "Harry Potter and the Philosopher’s Stone",
      price: 15,
    },
    {
      id: 4,
      imageUrl: "9780140434262.jpeg",
      authors: "Jane Austen",
      title: "Pride and Prejudice",
      price: 6,
    },
    {
      id: 5,
      imageUrl: "9780156012072.jpeg",
      authors: "Antoine de Saint-Exupéry",
      title: "The Little Prince",
      price: 5,
    },
    {
      id: 6,
      imageUrl: "9780142437209.jpeg",
      authors: "Charlotte Brontë",
      title: "Jane Eyre",
      price: 10,
    },
    {
      id: 7,
      imageUrl: "9780375831003.jpeg",
      authors: "Markus Zusak",
      title: "The Book Thief",
      price: 10,
    },
    {
      id: 8,
      imageUrl: "",
      authors: "J.R.R. Tolkien",
      title: "The Lord of the Rings",
      price: 10,
    },
    {
      id: 9,
      imageUrl: "",
      authors: "J.D. Salinger",
      title: "The Catcher in the Rye",
      price: 10,
    },
    {
      id: 10,
      imageUrl: "",
      authors: "F. Scott Fitzgerald",
      title: "The Great Gatsby",
      price: 12,
    },
  ];

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
        books={bestsellers}
        title="Bestsellers"
        backgroundColor="transparent"
        categoryBackgroundColor="#a4ae9d"
      />
    </div>
  );
}

export default Home;
