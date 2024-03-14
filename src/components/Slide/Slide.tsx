import { useState, useEffect } from "react";
import styles from "./Slide.module.css";

function Slide() {
  const imageUrls = [
    "slide1.webp",
    "slide2.webp",
    "slide3.webp",
    "slide4.webp",
    "slide5.webp",
    "slide6.webp",
    "slide7.webp",
    "slide8.webp",
    "slide9.webp",
    "slide10.webp",
    "slide11.webp",
    "slide12.webp",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Increment index or reset to 0 if it reaches the end
      setCurrentImageIndex((prevIndex) =>
        prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(intervalId); // Cleanup the interval on component unmount
  }, [imageUrls.length]);

  return (
    <div className={styles.container}>
      {imageUrls.map((imageUrl, index) => (
        <img
          key={index}
          src={imageUrl}
          alt={`slide ${index + 1}`}
          className={styles.image}
          style={{
            display: index === currentImageIndex ? "block" : "none",
          }}
        />
      ))}
      <div className={styles.buttons}>
        <button
          className={styles.button}
          onClick={() =>
            setCurrentImageIndex((prevIndex) =>
              prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1
            )
          }
        >
          <img src="prev.png" height={"16px"} alt="Previous" />
        </button>
        <button
          className={styles.button}
          onClick={() =>
            setCurrentImageIndex((prevIndex) =>
              prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1
            )
          }
        >
          <img src="next.png" height={"16px"} alt="Next" />
        </button>
      </div>
    </div>
  );
}

export default Slide;
