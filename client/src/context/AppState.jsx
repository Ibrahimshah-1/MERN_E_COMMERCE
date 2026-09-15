
import React, {
  useEffect,
  useState,
  useCallback
} from "react";

import AppContext from "./AppContext";

import axios from "axios";

import {
  ToastContainer,
  toast,
  Bounce
} from "react-toastify";


const AppState = (props) => {

  // ==========================================
  // STATE
  // ==========================================

  const [products, setProducts] = useState([]);

  const [token, setToken] = useState(
    () => localStorage.getItem("token") || ""
  );

  const [Authenticatd, setAuthenticatd] = useState(
    () => Boolean(localStorage.getItem("token"))
  );

  const [filterData, setFilterData] = useState([]);

  const [user, setUser] = useState();

  const [cart, setCart] = useState({
    items: []
  });

  const [reload, setReload] = useState(false);

  const [userAddress, setUserAddress] = useState("");


  // ==========================================
  // BACKEND URL
  // ==========================================

  const url = "http://localhost:3000/api";


  // ==========================================
  // FETCH PRODUCTS + USER DATA
  // ==========================================

  useEffect(() => {

    const fetchProduct = async () => {

      try {

        const api = await axios.get(
          `${url}/product/all`,
          {
            headers: {
              "Content-Type": "application/json"
            },

            withCredentials: true
          }
        );

        setProducts(api.data.products);

        setFilterData(api.data.products);

      } catch (error) {

        console.error(
          "Product API error:",
          error.response?.data ||
          error.message
        );

      }

    };


    // Fetch public products
    fetchProduct();


    // ------------------------------------------
    // Don't call protected APIs without token
    // ------------------------------------------

    if (!token) {
      return;
    }


    // ------------------------------------------
    // Fetch logged-in user data
    // ------------------------------------------

    userProfile();

    userCart();

    getAddress();


  }, [token, reload]);


  // ==========================================
  // REGISTER
  // ==========================================

  const register = async (
    name,
    email,
    password
  ) => {

    try {

      const api = await axios.post(
        `${url}/user/register`,
        {
          name,
          email,
          password
        },
        {
          headers: {
            "Content-Type":
              "application/json"
          },

          withCredentials: true
        }
      );


      console.log(
        "user register",
        api
      );


      toast.success(
        api.data.message,
        {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce
        }
      );


      return api.data;


    } catch (error) {

      console.log(
        "Register API error:",
        error.response?.data ||
        error.message
      );


      throw error;
    }

  };


  // ==========================================
  // VERIFY EMAIL
  // ==========================================

  const verifyEmail = async (
    email,
    code
  ) => {

    try {

      const api = await axios.post(
        `${url}/user/verify-email/`,
        {
          email,
          code
        },
        {
          headers: {
            "Content-Type":
              "application/json"
          },

          withCredentials: true
        }
      );


      console.log(
        "Email verification:",
        api.data
      );


      toast.success(
        api.data.message,
        {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce
        }
      );


      return api.data;


    } catch (error) {

      console.log(
        "Verify email error:",
        error.response?.data ||
        error.message
      );


      throw error;
    }

  };


  // ==========================================
  // LOGIN
  // ==========================================

  const login = async (
    email,
    password
  ) => {

    try {

      const api = await axios.post(
        `${url}/user/login`,
        {
          email,
          password
        },
        {
          headers: {
            "Content-Type":
              "application/json"
          },

          withCredentials: true
        }
      );


      // Save token in React state

      setToken(
        api.data.token
      );


      // Save authentication state

      setAuthenticatd(true);


      // Save token in localStorage

      localStorage.setItem(
        "token",
        api.data.token
      );


      toast.success(
        api.data.message,
        {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce
        }
      );


      return api.data;


    } catch (error) {

      console.log(
        "USer API error:",
        error.response?.data ||
        error.message
      );


      throw error;
    }

  };


  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = () => {

    setAuthenticatd(false);

    setToken("");

    localStorage.removeItem("token");


    toast.success(
      "Logout Successfully...!",
      {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce
      }
    );

  };


  // ==========================================
  // USER PROFILE
  // ==========================================

  const userProfile = async () => {

    try {

      const api = await axios.get(
        `${url}/user/profile`,
        {
          headers: {
            "Content-Type":
              "application/json",

            Auth:
              token
          },

          withCredentials: true
        }
      );


      setUser(
        api.data.user
      );


    } catch (error) {

      console.error(
        "User profile error:",
        error.response?.data ||
        error.message
      );

    }

  };


  // ==========================================
  // ADD TO CART
  // ==========================================

  const addToCart = async (
    productId,
    title,
    price,
    qty,
    imgSrc
  ) => {

    try {

      const api = await axios.post(
        `${url}/cart/add`,

        {
          productId,
          title,
          price,
          qty,
          imgSrc
        },

        {
          headers: {
            "Content-Type":
              "application/json",

            Auth:
              token
          },

          withCredentials: true
        }
      );


      // Reload user cart data

      setReload(
        !reload
      );


      console.log(
        "cart",
        api.data.cart.items
      );


      toast.success(
        api.data.message,
        {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce
        }
      );


    } catch (error) {

      console.error(
        "Add cart error:",
        error.response?.data ||
        error.message
      );

    }

  };


  // ==========================================
  // GET USER CART
  // ==========================================

  const userCart = async () => {

    try {

      const api = await axios.get(
        `${url}/cart/user`,
        {
          headers: {
            "Content-Type":
              "application/json",

            Auth:
              token
          },

          withCredentials: true
        }
      );


      setCart(
        api.data.cart
      );


    } catch (error) {

      console.error(
        "User cart error:",
        error.response?.data ||
        error.message
      );

    }

  };


  // ==========================================
  // DECREASE CART QUANTITY
  // ==========================================

  const decreaseQty = async (
    productId,
    qty
  ) => {

    try {

      const api = await axios.post(
        `${url}/cart/--qty`,
        {
          productId,
          qty
        },
        {
          headers: {
            "Content-Type":
              "application/json",

            Auth:
              token
          },

          withCredentials: true
        }
      );


      console.log(api);


      setReload(
        !reload
      );


      toast.success(
        api.data.message,
        {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce
        }
      );


    } catch (error) {

      console.error(
        "Decrease quantity error:",
        error.response?.data ||
        error.message
      );

    }

  };


  // ==========================================
  // REMOVE FROM CART
  // ==========================================

  const removeFromCart = async (
    productId
  ) => {

    try {

      const api = await axios.delete(
        `${url}/cart/remove/${productId}`,

        {
          headers: {
            "Content-Type":
              "application/json",

            Auth:
              token
          },

          withCredentials: true
        }
      );


      console.log(api);


      setReload(
        !reload
      );


      toast.success(
        api.data.message,
        {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce
        }
      );


    } catch (error) {

      console.error(
        "Remove cart error:",
        error.response?.data ||
        error.message
      );

    }

  };


  // ==========================================
  // CLEAR CART
  // ==========================================

 
const ClearCart = useCallback(async () => {
  try {

    const currentToken =
      token || localStorage.getItem("token");

    if (!currentToken) {
      throw new Error("Login token not found");
    }

    const api = await axios.delete(
      `${url}/cart/clear`,
      {
        headers: {
          "Content-Type": "Application/json",
          Auth: currentToken
        },
        withCredentials: true
      }
    );

    console.log(
      "Cart cleared:",
      api.data
    );

    // Update local cart only
    setCart({
      items: []
    });

    toast.success(
      api.data.message,
      {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce
      }
    );

    return api.data;

  } catch (error) {

    console.error(
      "Clear cart error:",
      error.response?.data ||
      error.message
    );

    throw error;
  }

}, [token, url]);



  // ==========================================
  // ADD SHIPPING ADDRESS
  // ==========================================

  const shippingAddress = async (
    fullName,
    address,
    city,
    state,
    country,
    pincode,
    phoneNumber
  ) => {

    try {

      const api = await axios.post(
        `${url}/address/add`,

        {
          fullName,
          address,
          city,
          state,
          country,
          pincode,
          phoneNumber
        },

        {
          headers: {
            "Content-Type":
              "application/json",

            Auth:
              token
          },

          withCredentials: true
        }
      );


      setReload(
        !reload
      );


      toast.success(
        api.data.message,
        {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce
        }
      );


      return api.data;


    } catch (error) {

      console.error(
        "Shipping address error:",
        error.response?.data ||
        error.message
      );

      throw error;

    }

  };


  // ==========================================
  // GET USER ADDRESS
  // ==========================================

  const getAddress = async () => {

    try {

      const api = await axios.get(
        `${url}/address/get`,
        {
          headers: {

            "Content-Type":
              "application/json",

            Auth:
              token

          },

          withCredentials: true

        }
      );


      setUserAddress(
        api.data.userAddress
      );


    } catch (error) {

      console.error(
        "Get address error:",
        error.response?.data ||
        error.message
      );

    }

  };


  // ==========================================
  // CONTEXT PROVIDER
  // ==========================================

  return (

    <AppContext.Provider
      value={{

        products,

        register,

        verifyEmail,

        login,

        url,

        token,

        Authenticatd,

        setAuthenticatd,

        filterData,

        setFilterData,

        logout,

        user,

        addToCart,

        cart,

        decreaseQty,

        removeFromCart,

        ClearCart,

        shippingAddress,

        userAddress

      }}
    >

      {props.children}

    </AppContext.Provider>

  );
};


export default AppState;

