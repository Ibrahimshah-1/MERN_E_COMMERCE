import express from "express";
import {
    register,
    verifyEmail,
    login,
    getAllUser,
    profile
} from "../Controllers/user.js";
import { Authenticated } from "../Middlewares/Auth.js";

const router = express.Router();

// POST /api/user/register
router.post("/register", register);

// post/api/user/verify-email/:token
router.post("/verify-email/", verifyEmail);


//login user 
//post / api/user/login

router.post('/login',login)

//get all users

router.get('/all',getAllUser)

// get user profile
router.get("/profile", Authenticated, profile);

export default router;