
import {
    useContext,
    useEffect,
    useRef,
    useState
} from "react";

import {
    useSearchParams,
    Link
} from "react-router-dom";

import axios from "axios";

import AppContext from "../context/AppContext";


const PaymentSuccess = () => {

    const [searchParams] = useSearchParams();

    const { ClearCart ,url } = useContext(AppContext);

    const [status, setStatus] = useState("checking");

    const [message, setMessage] = useState("");

    const processed = useRef(false);


    useEffect(() => {

        const tracker =
            searchParams.get("tracker");


        // --------------------------------
        // Tracker missing
        // --------------------------------

        if (!tracker) {

            setStatus("failed");

            setMessage(
                "Payment tracker was not found."
            );

            return;
        }


        // --------------------------------
        // Prevent duplicate processing
        // --------------------------------

        if (processed.current) {
            return;
        }


        // --------------------------------
        // Check payment
        // --------------------------------

        const checkPayment = async () => {

            try {

                const response = await axios.get(
                    `${url}/payment/status/${tracker}`
                );


                // --------------------------------
                // Payment successful
                // --------------------------------

                if (
                    response.data.success &&
                    response.data.state ===
                        "TRACKER_ENDED"
                ) {

                    // Make sure this runs only once
                    processed.current = true;


                    // Clear cart after successful
                    // payment confirmation

                    await ClearCart();


                    setStatus("success");

                    setMessage(
                        "Your payment was successful."
                    );


                } else {

                    setStatus("pending");

                    setMessage(
                        "Your payment is still being processed."
                    );

                }


            } catch (error) {

                console.error(
                    "Payment verification error:",
                    error
                );


                setStatus("failed");

                setMessage(
                    "Unable to verify your payment."
                );

            }

        };


        checkPayment();


    }, [searchParams, ClearCart]);


    return (

        <div className="container text-center my-5">


            {/* ================================= */}
            {/* CHECKING */}
            {/* ================================= */}

            {status === "checking" && (

                <>

                    <h2>
                        Checking Payment...
                    </h2>

                    <p>
                        Please wait while we verify your payment.
                    </p>

                </>

            )}


            {/* ================================= */}
            {/* SUCCESS */}
            {/* ================================= */}

            {status === "success" && (

                <>

                    <h2 className="text-success">
                        Payment Successful
                    </h2>

                    <p>
                        {message}
                    </p>

                    <p>
                        Your order has been confirmed.
                    </p>

                    <Link
                        to="/"
                        className="btn btn-primary"
                    >
                        Continue Shopping
                    </Link>

                </>

            )}


            {/* ================================= */}
            {/* PENDING */}
            {/* ================================= */}

            {status === "pending" && (

                <>

                    <h2>
                        Payment Processing
                    </h2>

                    <p>
                        {message}
                    </p>

                </>

            )}


            {/* ================================= */}
            {/* FAILED */}
            {/* ================================= */}

            {status === "failed" && (

                <>

                    <h2 className="text-danger">
                        Payment Verification Failed
                    </h2>

                    <p>
                        {message}
                    </p>

                    <Link
                        to="/"
                        className="btn btn-secondary"
                    >
                        Back to Home
                    </Link>

                </>

            )}

        </div>

    );

};


export default PaymentSuccess;

