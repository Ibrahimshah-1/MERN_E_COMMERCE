
import React, {
    useContext,
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import axios from "axios";

import RelatedProducts from "./RelatedProducts";

import AppContext from "../../context/AppContext";


const ProductDetail = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const { addToCart ,url} = useContext(AppContext);

    const [product, setProduct] = useState(null);



    useEffect(() => {

        const fetchProduct = async () => {

            try {

                const api = await axios.get(
                    `${url}/product/${id}`,
                    {
                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        withCredentials: true
                    }
                );

                setProduct(
                    api.data.product
                );

            } catch (error) {

                console.log(
                    "Product fetch error:",
                    error
                );

            }

        };

        fetchProduct();

    }, [id , url]);


    // ==========================================
    // ADD TO CART
    // ==========================================

    const handleAddToCart = async () => {

        try {
            if (!localStorage.getItem("token")) { alert("Please login first to add products to your cart."); navigate("/login"); return; }

            await addToCart(
                product._id,
                product.title,
                product.price,
                1,
                product.imgSrc
            );

        } catch (error) {

            console.error(
                "Add to cart error:",
                error
            );

        }

    };


    // ==========================================
    // BUY NOW
    // ==========================================

    const handleBuyNow = async () => {

        try {

            await addToCart(
                product._id,
                product.title,
                product.price,
                1,
                product.imgSrc
            );

            // After adding the product,
            // go to address page.

            navigate("/shipping");

        } catch (error) {

            console.error(
                "Buy now error:",
                error
            );

        }

    };


    // ==========================================
    // LOADING
    // ==========================================

    if (!product) {

        return (
            <h3 className="text-center my-5">
                Loading...
            </h3>
        );

    }


    return (

        <div className="product-page">

            <div className="container">

                <div className="product-detail">


                    {/* ================================= */}
                    {/* PRODUCT IMAGE */}
                    {/* ================================= */}

                    <div className="product-image-section">

                        <div className="product-image-box">

                            <img
                                src={product.imgSrc}
                                alt={product.title}
                            />

                        </div>

                    </div>


                    {/* ================================= */}
                    {/* PRODUCT INFO */}
                    {/* ================================= */}

                    <div className="product-info">

                        <p className="product-category">
                            {product.category}
                        </p>


                        <h1 className="product-title">
                            {product.title}
                        </h1>


                        <p className="product-description">
                            {product.description}
                        </p>


                        <div className="product-price">
                            {product.price}
                            {" "}
                            <span>
                                RS
                            </span>
                        </div>


                        <div className="product-stock">

                            {product.qty > 0
                                ? `${product.qty} items available`
                                : "Out of stock"}

                        </div>


                        {/* ================================= */}
                        {/* ACTION BUTTONS */}
                        {/* ================================= */}

                        <div className="product-actions">

                            <button
                                className="btn buy-btn"
                                disabled={
                                    product.qty <= 0
                                }
                                onClick={
                                    handleBuyNow
                                }
                            >
                                Buy Now
                            </button>


                            <button
                                className="btn cart-btn"
                                disabled={
                                    product.qty <= 0
                                }
                                onClick={
                                    handleAddToCart
                                }
                            >
                                Add To Cart
                            </button>

                        </div>

                    </div>

                </div>

            </div>


            <RelatedProducts
                category={product.category}
                productId={product._id}
            />

        </div>

    );

};


export default ProductDetail;

