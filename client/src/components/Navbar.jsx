import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AppContext from "../context/AppContext";

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { products, setFilterData, logout, Authenticatd, cart } =
    useContext(AppContext);

  const filterByCategory = (cat) => {
    setFilterData(
      products.filter(
        (item) => item.category.toLowerCase() === cat.toLowerCase(),
      ),
    );
  };
  // filterByCategory('watches')
  const submitHandler = (e) => {
    e.preventDefault();
    navigate(`/product/search/${searchTerm}`);
    setSearchTerm("");
  };
  return (
    <>
      <div className="nav">
        <div className="nav_bar">
          <Link
            to={"/"}
            className="left"
            style={{ textDecoration: "none", color: "white" }}
          >
            <h3>MERN E-COMMERCE</h3>
          </Link>

          <form className="search_bar" onSubmit={submitHandler}>
            <span className="material-symbols-outlined">search</span>{" "}
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Products"
            />
          </form>
          <div className="right">
            {Authenticatd && (
              <>
                <Link
                  to={"/cart"}
                  type="button"
                  className="btn btn-primary position-relative mx-3"
                >
                  <span className="material-symbols-outlined">
                    shopping_cart
                  </span>
                 {cart?.items?.length > 0 && (
                   <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cart?.items?.length}
                    <span className="visually-hidden">unread messages</span>
                  </span>
                 )}
                </Link>
                <Link to={"/profile"} className="btn btn-primary mx-3">
                  profile
                </Link>
                <button
                  className="btn btn-secondary mx-3"
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                >
                  Logout
                </button>
              </>
            )}
            {!Authenticatd && (
              <>
                <Link to={"/register"} className="btn btn-secondary mx-3">
                  Register
                </Link>
                <Link to={"/login"} className="btn btn-secondary mx-3">
                  Login
                </Link>
              </>
            )}
          </div>
        </div>

        {location.pathname == "/" && (
          <div className="sub_bar">
            <div className="items" onClick={() => setFilterData(products)}>
              No FIlter
            </div>
            <div className="items" onClick={() => filterByCategory("home")}>
              Home
            </div>
            <div
              className="items"
              onClick={() => filterByCategory("computers")}
            >
              Computers
            </div>
            <div className="items" onClick={() => filterByCategory("clothing")}>
              Clothing
            </div>
            <div
              className="items"
              onClick={() => filterByCategory("accessories")}
            >
              Accessories
            </div>
            <div
              className="items"
              onClick={() => filterByCategory("electronics")}
            >
              Electronics
            </div>
            <div className="items" onClick={() => filterByCategory("shoes")}>
              Shoes
            </div>
            <div className="items" onClick={() => filterByCategory("watches")}>
              Watches
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
