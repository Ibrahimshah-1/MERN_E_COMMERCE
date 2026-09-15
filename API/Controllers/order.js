
import Order from "../Models/Order.js";


// ==========================================
// CREATE ORDER
// ==========================================

export const createOrder = async (req, res) => {
    try {

        const {
            userId,
            items,
            totalAmount,
            shippingAddress
        } = req.body;


        // -----------------------------
        // Validation
        // -----------------------------

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }


        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Order must contain at least one item"
            });
        }


        if (!totalAmount || totalAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid total amount"
            });
        }


        // -----------------------------
        // Create order
        // -----------------------------

        const order = await Order.create({

            userId,

            items,

            totalAmount,

            shippingAddress,

            paymentStatus: "pending",

            paymentMethod: "safepay",

            orderStatus: "pending"

        });


        // -----------------------------
        // Response
        // -----------------------------

        return res.status(201).json({

            success: true,

            message: "Order created successfully",

            order

        });


    } catch (error) {

        console.error(
            "Create order error:",
            error.message
        );

        return res.status(500).json({

            success: false,

            message: "Failed to create order"

        });

    }
};

