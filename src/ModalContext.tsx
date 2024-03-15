import React, { createContext, useContext, useState, ReactNode } from "react";

interface ModalContextType {
  isCartOpen: boolean;
  isLogInOpen: boolean;
  isSignUpOpen: boolean;
  toggleCart: () => void;
  toggleLogInPopup: () => void;
  toggleSignUpPopup: () => void;
}

const defaultValue: ModalContextType = {
  isCartOpen: false,
  isLogInOpen: false,
  isSignUpOpen: false,
  toggleCart: () => {},
  toggleLogInPopup: () => {},
  toggleSignUpPopup: () => {},
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

  const toggleCart = () => {
    console.log("cart state", isCartOpen);
    setCartOpen((prevState) => !prevState);
  };

  const toggleLogInPopup = () => {
    setLogInOpen((prevState) => !prevState);
  };

  const toggleSignUpPopup = () => {
    setSignUpOpen((prevState) => !prevState);
  };

  return (
    <ModalContext.Provider
      value={{
        isCartOpen,
        isLogInOpen,
        isSignUpOpen,
        toggleCart,
        toggleLogInPopup,
        toggleSignUpPopup,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};
