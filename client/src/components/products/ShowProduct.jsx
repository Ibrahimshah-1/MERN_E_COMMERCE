import React, { useContext } from "react";
import AppContext from "../../context/AppContext";
import { Link } from "react-router-dom";

const ShowProduct = () => {
  const { products,filterData ,addToCart} = useContext(AppContext);
  return (
    <>
      <div className="container  d-flex justify-content-center align-items-center">
        <div className="row container d-flex justify-content-center align-items-center">
          {filterData?.map((product) => (
            <div
              key={product._id}
              className="my-3 col-md-4 d-flex justify-content-center align-items-center"
            >
              <div
                className="card bg-dark text-light text-center"
                style={{ width: "18rem" }}
              >
                <Link to={`/product/${product._id}`} className="d-flex justify-content-center align-items-center p-4">
                  <img
                    src={product.imgSrc}
                    className="card-img-top"
                    style={{
                      width: "260px",
                      height: "260px",
                      borderRadius: "10px",
                      border: "2px solid yellow",
                      objectFit:'cover'
                    }}
                    alt={product.title}
                  />
                </Link>

                <div className="card-body bg-dark text-light text-center">
                  <h5 className="card-title">{product?.title}</h5>
                  <div className="my-4">
                    {" "}
                    <button href="#" className="btn btn-primary mx-3">
                      {product.price} RS{" "}
                    </button>
                    <button href="#" className="btn btn-warning" onClick={()=>addToCart(product?._id, product?.title, product?.price, 1, product?.imgSrc)}>
                      Add to Cart{" "}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ShowProduct;
