import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import Catalog from "./pages/Catalog/Catalog";
import Wishlist from "./pages/Wishlist/Wishlist";
import PersonalCabinet from "./pages/PersonalCabinet/PersonalCabinet";

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <div style={{ paddingTop: "104px" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/cabinet" element={<PersonalCabinet />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
