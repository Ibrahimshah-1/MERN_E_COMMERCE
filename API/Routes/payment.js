import express from "express";

import {
    createPayment,
    webhook,
    getPaymentStatus
} from "../Controllers/payment.js";

const router = express.Router();

router.post("/create", createPayment);

router.get("/status/:tracker", getPaymentStatus);

router.post("/webhook", webhook);

export default router;