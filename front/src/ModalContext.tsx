import React, { createContext, useContext, useState, ReactNode } from "react";

interface ModalContextType {
  isCartOpen: boolean;
  isLogInOpen: boolean;
  isSignUpOpen: boolean;
  isErrorPopupOpen: boolean;
  toggleCart: () => void;
  toggleLogInPopup: () => void;
  toggleSignUpPopup: () => void;
  toggleErrorPopup: () => void;
  errorPopupText: string;
  setErrorPopupText: (errorString: string) => void;
}

const defaultValue: ModalContextType = {
  isCartOpen: false,
  isLogInOpen: false,
  isSignUpOpen: false,
  isErrorPopupOpen: false,
  errorPopupText: "",
  toggleCart: () => {},
  toggleLogInPopup: () => {},
  toggleSignUpPopup: () => {},
  toggleErrorPopup: () => {},
  setErrorPopupText: () => {},
};

const ModalContext = createContext(defaultValue);

export const useModal = () => useContext(ModalContext);

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [isCartOpen, setCartOpen] = useState(false);
  const [isLogInOpen, setLogInOpen] = useState(false);
  const [isSignUpOpen, setSignUpOpen] = useState(false);
  const [isErrorPopupOpen, setErrorPopupOpen] = useState(false);
  const [errorPopupText, setErrorText] = useState("");

  const toggleCart = () => {
    setCartOpen((prevState) => !prevState);
  };

  const toggleLogInPopup = () => {
    setLogInOpen((prevState) => !prevState);
  };

  const toggleSignUpPopup = () => {
    setSignUpOpen((prevState) => !prevState);
  };

  const toggleErrorPopup = () => {
    setErrorPopupOpen((prevState) => !prevState);
  };
  const setErrorPopupText = (errorText: string) => {
    setErrorText(errorText);
  };

  return (
    <ModalContext.Provider
      value={{
        isCartOpen,
        isLogInOpen,
        isSignUpOpen,
        isErrorPopupOpen,
        errorPopupText,
        toggleCart,
        toggleLogInPopup,
        toggleSignUpPopup,
        toggleErrorPopup,
        setErrorPopupText,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};
