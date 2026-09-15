
import Safepay from "@sfpy/node-core";
import axios from "axios";

import Order from "../Models/Order.js";
import { Products } from "../Models/Products.js";


const safepay = Safepay(
    process.env.SAFEPAY_SECRET_KEY,
    {
        authType: "secret",
        host: "https://sandbox.api.getsafepay.com"
    }
);


// ==========================================
// CREATE PAYMENT
// ==========================================

export const createPayment = async (req, res) => {

    try {

        const { amount, orderId } = req.body;

        console.log("1. Payment request received");


        // --------------------------------
        // Validate amount
        // --------------------------------

        if (!amount || amount <= 0) {

            return res.status(400).json({
                success: false,
                message: "Invalid amount"
            });

        }


        // --------------------------------
        // Validate orderId
        // --------------------------------

        if (!orderId) {

            return res.status(400).json({
                success: false,
                message: "Order ID is required"
            });

        }


        // --------------------------------
        // Find order
        // --------------------------------

        const order = await Order.findById(orderId);


        if (!order) {

            return res.status(404).json({
                success: false,
                message: "Order not found"
            });

        }


        // --------------------------------
        // Make sure amount matches order
        // --------------------------------

        if (
            Number(amount) !==
            Number(order.totalAmount)
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Payment amount does not match order total"
            });

        }


        // ==========================================
        // 1. CREATE SAFEPAY PAYMENT SESSION
        // ==========================================

        const paymentResponse =
            await safepay.payments.session.setup({

                merchant_api_key:
                    process.env.SAFEPAY_PUBLIC_KEY,

                intent: "CYBERSOURCE",

                mode: "payment",

                entry_mode: "raw",

                currency: "PKR",

                // Your database stores PKR.
                // Safepay expects the smallest denomination.
                amount:
                    Number(order.totalAmount) * 100,

                metadata: {
                    order_id: orderId
                },

                include_fees: false

            });


        console.log(
            "2. Payment session created"
        );


        const tracker =
            paymentResponse
                .data
                .tracker
                .token;


        console.log(
            "Tracker:",
            tracker
        );


        // ==========================================
        // 2. SAVE TRACKER TO ORDER
        // ==========================================

        order.safepayTracker = tracker;

        await order.save();


        console.log(
            "3. Tracker saved to order"
        );


        // ==========================================
        // 3. CREATE AUTHENTICATION TOKEN
        // ==========================================

        const authResponse = await axios.post(

            "https://sandbox.api.getsafepay.com/client/passport/v1/token",

            {},

            {
                headers: {

                    "X-SFPY-MERCHANT-SECRET":
                        process.env.SAFEPAY_SECRET_KEY,

                    "Content-Type":
                        "application/json"

                }
            }

        );


        console.log(
            "4. Authentication token created"
        );


        const authToken =
            authResponse.data.data;


        // ==========================================
        // 4. CREATE CHECKOUT URL
        // ==========================================

        const checkoutURL =
            safepay.checkout.createCheckoutUrl({

                env: "sandbox",

                tracker: tracker,

                tbt: authToken,

                source: "hosted",

                redirect_url:
                    "http://localhost:5173/payment/success",

                cancel_url:
                    "http://localhost:5173/payment/cancel"

            });


        console.log(
            "5. Checkout URL created"
        );

 
        // ==========================================
        // RESPONSE
        // ==========================================

        return res.status(200).json({

            success: true,

            message:
                "Payment session created",

            checkoutURL,

            tracker,

            orderId:
                order._id

        });


    } catch (error) {

        console.error(
            "Safepay payment error:",
            error.response?.data ||
            error.message
        );


        return res.status(500).json({

            success: false,

            message:
                "Payment creation failed"

        });

    }

};


// ==========================================
// SAFEPAY WEBHOOK
// ==========================================

export const webhook = async (req, res) => {

    try {

        console.log(
            "========== SAFEPAY WEBHOOK =========="
        );


        // --------------------------------
        // Verify webhook
        // --------------------------------

        const valid =
            await safepay.verify.webhook(req);


        if (!valid) {

            console.log(
                "Invalid Safepay webhook signature"
            );


            return res.status(400).json({

                success: false,

                message:
                    "Invalid webhook signature"

            });

        }


        console.log(
            "Webhook signature verified"
        );


        // --------------------------------
        // Read event
        // --------------------------------

        const event = req.body;


        console.log(
            "Webhook event:"
        );


        console.log(event);


        // --------------------------------
        // Only process successful payment
        // --------------------------------

        if (
            event.type !==
            "payment.succeeded"
        ) {

            console.log(
                "Ignoring webhook event:",
                event.type
            );


            return res.status(200).json({

                success: true,

                message:
                    "Event ignored"

            });

        }


        // --------------------------------
        // Payment data
        // --------------------------------

        const payment =
            event.data;


        // --------------------------------
        // Get tracker
        // --------------------------------

        const tracker =
            payment?.tracker ||
            payment?.token;


        if (!tracker) {

            console.log(
                "Tracker not found in webhook"
            );


            return res.status(400).json({

                success: false,

                message:
                    "Tracker not found"

            });

        }


        console.log(
            "Safepay tracker:",
            tracker
        );


        // --------------------------------
        // Find order
        // --------------------------------

        const order =
            await Order.findOne({
                safepayTracker: tracker
            });


        if (!order) {

            console.log(
                "Order not found for tracker:",
                tracker
            );


            return res.status(404).json({

                success: false,

                message:
                    "Order not found"

            });

        }


        // --------------------------------
        // Prevent duplicate processing
        // --------------------------------

        if (
            order.paymentStatus ===
            "paid"
        ) {

            console.log(
                "Order already paid:",
                order._id
            );


            return res.status(200).json({

                success: true,

                message:
                    "Order already processed"

            });

        }


        // ==========================================
        // DECREASE PRODUCT STOCK
        // ==========================================

        for (const item of order.items) {

            const product =
                await Products.findById(
                    item.productId
                );


            if (!product) {

                throw new Error(
                    `Product not found: ${item.productId}`
                );

            }


            if (
                product.qty <
                item.qty
            ) {

                throw new Error(
                    `Insufficient stock for product: ${product.title}`
                );

            }


            product.qty -= item.qty;

            await product.save();

        }


        // ==========================================
        // MARK ORDER AS PAID
        // ==========================================

        order.paymentStatus =
            "paid";

        order.orderStatus =
            "processing";


        // Save Safepay charge ID

        if (
            payment?.charge?.token
        ) {

            order.paymentId =
                payment.charge.token;

        }


        await order.save();


        console.log(
            "Order marked as paid:",
            order._id
        );


        // --------------------------------
        // Respond to Safepay
        // --------------------------------

        return res.status(200).json({

            success: true,

            message:
                "Payment confirmed"

        });


    } catch (error) {

        console.error(
            "Webhook error:",
            error.response?.data ||
            error.message
        );


        return res.status(500).json({

            success: false,

            message:
                "Webhook processing failed"

        });

    }

};


// ==========================================
// GET PAYMENT STATUS
// ==========================================

export const getPaymentStatus = async (req, res) => {

    try {

        const { tracker } =
            req.params;


        // --------------------------------
        // Validate tracker
        // --------------------------------

        if (!tracker) {

            return res.status(400).json({

                success: false,

                message:
                    "Tracker is required"

            });

        }


        // ==========================================
        // 1. FETCH TRACKER FROM SAFEPAY
        // ==========================================

        const response =
            await safepay.reporter.payments.fetch(
                tracker
            );


        const trackerData =
            response.data;


        console.log(
            "Tracker state:",
            trackerData.state
        );


        // ==========================================
        // 2. PAYMENT NOT FINISHED
        // ==========================================

        if (
            trackerData.state !==
            "TRACKER_ENDED"
        ) {

            return res.status(200).json({

                success: true,

                tracker:
                    trackerData.token,

                state:
                    trackerData.state

            });

        }


        // ==========================================
        // 3. FIND ORDER
        // ==========================================

        const order =
            await Order.findOne({

                safepayTracker:
                    tracker

            });


        if (!order) {

            return res.status(404).json({

                success: false,

                message:
                    "Order not found"

            });

        }


        // ==========================================
        // 4. ALREADY PAID
        // ==========================================

        if (
            order.paymentStatus ===
            "paid"
        ) {

            console.log(
                "Order already processed:",
                order._id
            );


            return res.status(200).json({

                success: true,

                tracker:
                    trackerData.token,

                state:
                    trackerData.state,

                message:
                    "Order already paid"

            });

        }


        // ==========================================
        // 5. DECREASE PRODUCT STOCK
        // ==========================================

        for (const item of order.items) {

            const product =
                await Products.findById(
                    item.productId
                );


            if (!product) {

                throw new Error(
                    `Product not found: ${item.productId}`
                );

            }


            if (
                product.qty <
                item.qty
            ) {

                throw new Error(
                    `Insufficient stock for product: ${product.title}`
                );

            }


            product.qty -= item.qty;

            await product.save();

        }


        // ==========================================
        // 6. MARK ORDER AS PAID
        // ==========================================

        order.paymentStatus =
            "paid";

        order.orderStatus =
            "processing";


        if (
            trackerData.charge?.token
        ) {

            order.paymentId =
                trackerData.charge.token;

        }


        await order.save();


        console.log(
            "Order marked as paid:",
            order._id
        );


        // ==========================================
        // 7. RESPONSE
        // ==========================================

        return res.status(200).json({

            success: true,

            tracker:
                trackerData.token,

            state:
                trackerData.state,

            message:
                "Payment confirmed and stock updated"

        });


    } catch (error) {

        console.error(
            "Payment status error:",
            error.response?.data ||
            error.message
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to get payment status"

        });

    }

};
