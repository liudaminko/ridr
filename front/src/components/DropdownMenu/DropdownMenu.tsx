import styles from "./DropdownMenu.module.css";

interface DropdownMenuProps {
  options: string[];
  optionImages: string[];
  onOptionClick: (option: string) => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  options,
  optionImages,
  onOptionClick,
}) => {
  return (
    <div className={styles.dropdownContainer}>
      {options.map((option, index) => (
        <div
          key={option}
          onClick={() => onOptionClick(option)}
          className={styles.dropdownOption}
        >
          {option}
          {optionImages[index] != "" && (
            <img
              key={index}
              src={optionImages[index]}
              style={{ height: "24px" }}
              alt={`${option} Image`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default DropdownMenu;
