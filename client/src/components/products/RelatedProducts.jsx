import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AppContext from "../../context/AppContext";

const RelatedProducts = ({ category, productId }) => {

    const { products } = useContext(AppContext);

    const relatedProducts = products?.filter(
        (product) =>
            product?._id !== productId &&
            product?.category?.toLowerCase() === category?.toLowerCase()
    );

    return (
        <section className="related-products">

            <div className="related-products-header">
                <div>
                    <h2>Related Products</h2>
                    <p>You may also like</p>
                </div>
            </div>

            <div className="related-products-grid">

                {relatedProducts?.map((product) => (

                    <div
                        className="related-product-card"
                        key={product._id}
                    >

                        <Link
                            to={`/product/${product._id}`}
                            className="related-product-image"
                        >
                            <img
                                src={product.imgSrc}
                                alt={product.title}
                            />
                        </Link>

                        <div className="related-product-body">

                            <h5>
                                {product.title}
                            </h5>

                            <p className="related-product-price">
                                {product.price} RS
                            </p>

                            <div className="related-product-actions">

                                <button className="btn">
                                    Add To Cart
                                </button>

                            </div>

                        </div>

                    </div>

                ))}

            </div>

        </section>
    );
};

export default RelatedProducts;