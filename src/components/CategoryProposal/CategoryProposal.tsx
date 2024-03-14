import styles from "./CategoryProposal.module.css";

interface Category {
  name: string;
  image?: string;
}

function CategoryProposal() {
  const categories: Category[] = [
    { name: "sale", image: "fire.png" },
    { name: "new books" },
    { name: "best sellers" },
    { name: "our recommendations" },
    { name: "fiction" },
    { name: "nonfiction" },
    { name: "kids" },
  ];

  return (
    <div className={styles.container}>
      {categories.map((category, index) => (
        <div key={index} className={styles.category}>
          {category.name}

          {index === 0 && category.image && (
            <img
              src={category.image}
              alt={`${category.name} category`}
              style={{ height: "1rem" }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default CategoryProposal;
