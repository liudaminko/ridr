import { useState } from "react";
import styles from "./SortingDropdown.module.css";

interface Props {
  onSortChange: (option: string) => void;
}

function SortingDropdown({ onSortChange }: Props) {
  const [selectedOption, setSelectedOption] = useState("Newest");
  const [showOptions, setShowOptions] = useState(false);

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    if (onSortChange) {
      onSortChange(option);
    }
  };

  const handleToggleOptions = () => {
    setShowOptions(!showOptions);
  };

  return (
    <div className={styles.dropdown}>
      <p>Sort by</p>
      <button className={styles.dropButton} onClick={handleToggleOptions}>
        {selectedOption}
        {showOptions ? (
          <img src="/opened_orange.png" height={"16px"} alt="toggle" />
        ) : (
          <img src="/closed_orange.png" height={"16px"} alt="toggle" />
        )}
      </button>
      {showOptions && (
        <div className={styles.dropdownContent}>
          {[
            "Sort by A - Z",
            "Sort by Z - A",
            "Price: Cheapest first",
            "Price: Expensive first",
            "Popular",
            "Newest",
          ].map((option, index) => (
            <div
              key={index}
              className={styles.option}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SortingDropdown;
