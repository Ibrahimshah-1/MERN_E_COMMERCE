import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },

        title: {
            type: String,
            required: true
        },

        price: {
            type: Number,
            required: true
        },

        qty: {
            type: Number,
            required: true
        },

        imgSrc: {
            type: String
        }
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        items: {
            type: [orderItemSchema],
            required: true
        },

        totalAmount: {
            type: Number,
            required: true
        },

        shippingAddress: {
            fullName: String,
            address: String,
            city: String,
            state: String,
            country: String,
            pincode: String,
            phoneNumber: String
        },

        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending"
        },

        paymentMethod: {
            type: String,
            default: "safepay"
        },

        paymentId: {
            type: String
        },

        safepayTracker: {
            type: String
        },

        orderStatus: {
            type: String,
            enum: [
                "pending",
                "processing",
                "shipped",
                "delivered",
                "cancelled"
            ],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;