import jwt from "jsonwebtoken";
import { User } from "../Models/User.js";

export const Authenticated = async (req, res, next) => {

    try {

        const token = req.header("Auth");

        if (!token) {
            return res.status(401).json({
                message: "Login required",
                success: false
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        req.user = user;

        next();

    } catch (error) {

        console.log("Authentication error:", error);

        return res.status(401).json({
            message: "Invalid or expired token",
            success: false
        });
    }
};