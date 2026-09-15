import { User } from "../Models/User.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendEmail } from "../utils/sendemail.js";
import jwt from 'jsonwebtoken'



//registration
export const register = async (req, res) => {

    const { name, email, password } = req.body;

    try {

        // 1. Check required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }

        // 2. Check email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Please enter a valid email address",
                success: false
            });
        }

        // 3. Check strong password
        const strongPassword =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&]).{8,}$/;;

        if (!strongPassword.test(password)) {
            return res.status(400).json({
                message:
                    "Password must be at least 8 characters and contain uppercase, lowercase, number and special character",
                success: false
            });
        }

        // 4. Check if email already exists
        let user = await User.findOne({ email });

        if (user) {
            return res.status(409).json({
                message: "User already exists",
                success: false
            });
        }

        // 5. Hash password
        const hashPassword = await bcrypt.hash(password, 10);

        // 6. Generate verification token
       const verificationCode =
    Math.floor(100000 + Math.random() * 900000).toString();

        // 7. Token expires after 1 hour
       const verificationCodeExpires = new Date(
    Date.now() + 60 * 60 * 1000
);

        // 8. Create user
        user = await User.create({
            name,
            email,
            password: hashPassword,
            verificationCode,
verificationCodeExpires
        });

      
   

        // 10. Send verification email
       
await sendEmail(
    email,
    "Verify your Ecommerce account",
    `
        <div style="
            max-width: 600px;
            margin: 40px auto;
            padding: 40px;
            background-color: #ffffff;
            font-family: Arial, sans-serif;
            border-radius: 10px;
            text-align: center;
        ">

            <h1 style="
                color: #111827;
                margin-bottom: 30px;
            ">
                Ecommerce
            </h1>

            <h2 style="color: #111827;">
                Verify your email address
            </h2>

            <p style="
                color: #4b5563;
                font-size: 16px;
            ">
                Hello ${name},
            </p>

            <p style="
                color: #4b5563;
                font-size: 16px;
            ">
                Thank you for creating an account with Ecommerce.
            </p>

            <p style="
                color: #4b5563;
                font-size: 16px;
            ">
                Please enter the verification code below:
            </p>

            <div style="
                margin: 30px auto;
                padding: 20px;
                background-color: #f3f4f6;
                border-radius: 8px;
                width: 200px;
            ">

                <p style="
                    margin: 0 0 10px;
                    color: #6b7280;
                    font-size: 14px;
                ">
                    Verification code
                </p>

                <h1 style="
                    margin: 0;
                    color: #111827;
                    font-size: 36px;
                    letter-spacing: 8px;
                ">
                    ${verificationCode}
                </h1>

            </div>

            <p style="
                color: #6b7280;
                font-size: 14px;
            ">
                This code will expire in <strong>1 hour</strong>.
            </p>

            <p style="
                color: #9ca3af;
                font-size: 13px;
                margin-top: 30px;
            ">
                If you did not create this account, you can safely ignore
                this email.
            </p>

        </div>
    `
);

        

        // 11. Send response
        res.status(201).json({
            message:
                "User registered successfully. Please check your email to verify your account.",
            success: true
        });

    } catch (error) {

        console.error("Registration error:", error);

        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

//verifiying email

export const verifyEmail = async (req, res) => {

    const { email, code } = req.body;

    try {

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        if (user.emailVerified) {
            return res.status(400).json({
                message: "Email is already verified",
                success: false
            });
        }

        if (user.verificationCode !== code) {
            return res.status(400).json({
                message: "Invalid verification code",
                success: false
            });
        }

        if (user.verificationCodeExpires < new Date()) {
            return res.status(400).json({
                message: "Verification code has expired",
                success: false
            });
        }

        user.emailVerified = true;

        user.verificationCode = undefined;
        user.verificationCodeExpires = undefined;

        await user.save();

        return res.status(200).json({
            message: "Email verified successfully",
            success: true
        });

    } catch (error) {

        console.error("Email verification error:", error);

        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};


//user login

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        // Check email verification
        if (!user.emailVerified) {
            return res.status(403).json({
                message: "Please verify your email before logging in",
                success: false
            });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid password",
                success: false
            });
        }

        // Create JWT
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        return res.status(200).json({
            message: "Login successful",
            token,
            success: true
        });

    } catch (error) {
        console.log("Login error:", error);

        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

//get all user

export const getAllUser = async (req, res) => {
    try {

        const users = await User
            .find()
            .select("-password -verificationToken -verificationTokenExpires")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            users
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    
};
}

// get profile


 export const profile = async (req,res)=>{
     res.json({user:req.user})
 }

