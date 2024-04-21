import { useState } from "react";
import styles from "./ActionSelector.module.css";

interface ActionSelectorProps {
  onSelectAction: (action: string) => void;
}

function ActionSelector({ onSelectAction }: ActionSelectorProps) {
  const actions = ["View", "Add", "Edit", "Delete"];
  const [selectedAction, setSelectedAction] = useState<string>("View");

  const handleSelectAction = (action: string) => {
    setSelectedAction(action);
    onSelectAction(action);
  };

  return (
    <div className={styles.actionsContainer}>
      {actions.map((action) => (
        <div
          key={action}
          className={`${styles.action} ${
            selectedAction === action ? styles.selected : ""
          }`}
          onClick={() => handleSelectAction(action)}
        >
          {action}
        </div>
      ))}
    </div>
  );
}

export default ActionSelector;
