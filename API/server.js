import "dotenv/config";

import express from "express";
import mongoose from "mongoose";
import registerRoute from "./Routes/user.js";
import productRoute from './Routes/product.js'
import cartRouter from './Routes/cart.js'
import addressRouter from './Routes/address.js'
import cors from 'cors' 
import paymentRoute from "./Routes/payment.js";
import orderRoute from "./Routes/order.js";
const app = express();
  
app.use(express.json());
 
app.use(cors({
    origin:true, 
    methods:["POST","GET","PUT","DELETE"],
    credentials:true


}))

mongoose.connect(process.env.MONGO_URL, {
    dbName: "ECOMMERCE_MERN_STACK"
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

// home route
app.get("/", (req, res) => {
    return res.json({
        message: "Welcome to home route"
    });
});

// register router
app.use("/api/user", registerRoute);

// products router

app.use('/api/product',productRoute)

//cart router

app.use('/api/cart',cartRouter)

// address Router
app.use('/api/address',addressRouter)

//payment route



app.use("/api/payment", paymentRoute);  


//order 



app.use("/api/order", orderRoute); 
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});