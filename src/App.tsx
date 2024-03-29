import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import Catalog from "./pages/Catalog/Catalog";
import Wishlist from "./pages/Wishlist/Wishlist";
import PersonalCabinet from "./pages/PersonalCabinet/PersonalCabinet";
import ShoppingCart from "./components/ShoppingCart/ShoppingCart";
import BookDetails from "./pages/BookDetails/BookDetails";
import LogInPopup from "./components/LogInPopup/LogInPopup";
import SignUpPopup from "./components/SignUpPopup/SignUpPopup";
import { ModalProvider } from "./ModalContext";

function App() {
  return (
    <ModalProvider>
      <div className="App">
        <Router>
          <Header />
          <div style={{ paddingTop: "104px" }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/cabinet" element={<PersonalCabinet />} />
              <Route path="/book/:id" element={<BookDetails />} />
            </Routes>
          </div>
          <Footer />
          <ShoppingCart />
          <LogInPopup />
          <SignUpPopup />
        </Router>
      </div>
    </ModalProvider>
  );
}

export default App;
