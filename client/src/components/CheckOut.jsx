
import React, {
  useContext,
  useEffect,
  useState
} from "react"; 

import axios from "axios";

import AppContext from "../context/AppContext";

import { useNavigate } from "react-router-dom";

import TableProduct from "../TableProduct";

const CheckOut = () => {

  const {
    cart,
    user,
    userAddress,
    url
  } = useContext(AppContext);

  const navigate = useNavigate();

  const [qty, setQty] = useState(0);

  const [price, setPrice] = useState(0);

  const [loading, setLoading] = useState(false);


  // ==========================================
  // CALCULATE TOTAL QUANTITY AND PRICE
  // ==========================================

  useEffect(() => {

    let totalQty = 0;
    let totalPrice = 0;

    if (cart?.items) {

      for (let i = 0; i < cart.items.length; i++) {

        totalQty += Number(cart.items[i].qty);

        totalPrice +=
          Number(cart.items[i].price) *
          Number(cart.items[i].qty);

      }

    }

    setQty(totalQty);

    setPrice(totalPrice);

  }, [cart]);


  // ==========================================
  // PROCEED TO PAY
  // ==========================================

  const handlePayment = async () => {

    try {

      setLoading(true);


      // ----------------------------------------
      // 1. Check user
      // ----------------------------------------

      if (!user?._id) {

        alert("Please login before placing an order.");

        navigate("/login");

        return;

      }


      // ----------------------------------------
      // 2. Check cart
      // ----------------------------------------

      if (
        !cart?.items ||
        cart.items.length === 0
      ) {

        alert("Your cart is empty.");

        return;

      }


      // ----------------------------------------
      // 3. Check shipping address
      // ----------------------------------------

      if (!userAddress) {

        alert("Please add a shipping address.");

        return;

      }


      // ----------------------------------------
      // 4. Prepare order items
      // ----------------------------------------

      const orderItems = cart.items.map((item) => ({

        productId: item.productId,

        title: item.title,

        price: Number(item.price),

        qty: Number(item.qty),

        imgSrc: item.imgSrc

      }));


      // ----------------------------------------
      // 5. Create MongoDB order
      // ----------------------------------------

      console.log(
        "Creating MongoDB order..."
      );

      const orderResponse = await axios.post(
        `${url}/order/create`,
        {
          userId: user._id,

          items: orderItems,

          totalAmount: price,

          shippingAddress: {
            fullName:
              userAddress.fullName,

            address:
              userAddress.address,

            city:
              userAddress.city,

            state:
              userAddress.state,

            country:
              userAddress.country,

            pincode:
              userAddress.pincode,

            phoneNumber:
              userAddress.phoneNumber
          }
        }
      );


      if (!orderResponse.data.success) {

        throw new Error(
          orderResponse.data.message ||
          "Failed to create order"
        );

      }


      const order =
        orderResponse.data.order;


      console.log(
        "Order created:",
        order._id
      );


      // ----------------------------------------
      // 6. Create Safepay payment
      // ----------------------------------------

      console.log(
        "Creating Safepay payment..."
      );

      const paymentResponse =
        await axios.post(
          `${url}/payment/create`,
          {
            amount: price,

            orderId: order._id
          }
        );


      if (!paymentResponse.data.success) {

        throw new Error(
          paymentResponse.data.message ||
          "Failed to create payment"
        );

      }


      const checkoutURL =
        paymentResponse.data.checkoutURL;


      console.log(
        "Safepay checkout URL created"
      );


      // ----------------------------------------
      // 7. Redirect to Safepay
      // ----------------------------------------

      window.location.href = checkoutURL;

    } catch (error) {

      console.error(
        "Checkout payment error:",
        error.response?.data ||
        error.message
      );


      alert(
        error.response?.data?.message ||
        error.message ||
        "Payment failed"
      );

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // UI
  // ==========================================

  return (
    <>

      <div className="container my-3">

        <h1 className="text-center">
          Order Summary
        </h1>


        <table
          className="table table-bordered border-primary"
          style={{
            background: "black"
          }}
        >

          <thead>

            <tr className="text-center">

              <th className="bg-dark text-light">
                Products
              </th>

              <th className="bg-dark text-light">
                Shipping Address
              </th>

            </tr>

          </thead>


          <tbody>

            <tr>

              <td className="bg-dark text-light">

                <TableProduct cart={cart} />

              </td>


              <td className="bg-dark text-light">

                <ul
                  style={{
                    fontWeight: "bold"
                  }}
                >

                  <li>
                    Name:
                    {" "}
                    {userAddress?.fullName}
                  </li>

                  <li>
                    Phone:
                    {" "}
                    {userAddress?.phoneNumber}
                  </li>

                  <li>
                    Country:
                    {" "}
                    {userAddress?.country}
                  </li>

                  <li>
                    State:
                    {" "}
                    {userAddress?.state}
                  </li>

                  <li>
                    PinCode:
                    {" "}
                    {userAddress?.pincode}
                  </li>

                  <li>
                    Near By:
                    {" "}
                    {userAddress?.address}
                  </li>

                </ul>

              </td>

            </tr>

          </tbody>

        </table>


        <div className="text-center">

          <h4>
            Total Quantity: {qty}
          </h4>

          <h4>
            Total Price: PKR {price}
          </h4>

        </div>

      </div>


      <div className="container text-center my-5">

        <button
          type="button"
          className="btn btn-secondary btn-lg"
          style={{
            fontWeight: "bold"
          }}
          onClick={handlePayment}
          disabled={loading}
        >

          {loading
            ? "Processing..."
            : "Proceed To Pay"}

        </button>

      </div>

    </>
  );
};

export default CheckOut;

