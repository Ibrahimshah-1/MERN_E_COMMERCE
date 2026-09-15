import { Address } from "../Models/Address.js";

export const addAddress = async (req, res) => {

    try {

        const {
            fullName,
            address,
            city,
            state,
            country,
            pincode,
            phoneNumber
        } = req.body;

        const userId = req.user._id;

        const userAddress = await Address.create({
            userId,
            fullName,
            address,
            city,
            state,
            country,
            pincode,
            phoneNumber
        });

        return res.status(201).json({
            message: "Address added",
            userAddress,
            success: true
        });

    } catch (error) {

        console.log("Add address error:", error);

        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};


export const getAddress = async (req, res) => {

    try {

        const userId = req.user._id;

        const addresses = await Address
            .find({ userId })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Addresses",
            userAddress: addresses[0] || null,
            success: true
        });

    } catch (error) {

        console.log("Get address error:", error);

        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};