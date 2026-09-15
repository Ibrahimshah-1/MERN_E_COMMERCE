import express from "express";
import { createOrder } from "../Controllers/order.js";

const router = express.Router();

router.post("/create", createOrder);

export default router;