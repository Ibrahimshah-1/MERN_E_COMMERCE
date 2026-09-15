import React, { useContext } from "react";
import AppContext from "./context/AppContext";
import ShowProduct from "./components/products/ShowProduct";
import ProductDetail from "./components/products/ProductDetail";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import SearchProduct from "./components/products/SearchProduct";
import Register from "./components/user/Register";
import { ToastContainer, toast } from "react-toastify";
import Login from "./components/user/Login";
import Profile from "./components/user/Profile";
import Cart from "./components/Cart";
import Address from "./components/Address";
import CheckOut from "./components/CheckOut";
import PaymentSuccess from "./components/PaymentSuccess"; 
const App = () => {
  // const {products} = useContext(AppContext) 
  return (
    <>
      <Router>
        <Navbar />
        <ToastContainer />
        <Routes>
          <Route path="/" element={<ShowProduct />} />
          <Route path="/product/search/:term" element={<SearchProduct />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/shipping" element={<Address />} />
          <Route path="/checkout" element={<CheckOut />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
        </Routes>
      </Router>
    </>
  );
};

export default App; 
 