import express from 'express'
import { addToCart, clearCart, decreaseProductQty, getUserCart, removeProductFromCart } from '../Controllers/cart.js'
import { Authenticated } from '../Middlewares/Auth.js'



const router = express.Router()


//add product
//post
//api/cart/add

router.post('/add',Authenticated,addToCart)


//get suser product
//get
//api/cart/user

router.get('/user',Authenticated,getUserCart)


//delete suser product
//delete
//api/cart/remove/:productId

router.delete('/remove/:productId',Authenticated,removeProductFromCart)


//delete suser cart
//delete
//api/cart/clear

router.delete('/clear',Authenticated,clearCart)

//decrese suser cart qty
//post
//api/cart/--qty

router.post('/--qty',Authenticated,decreaseProductQty)
export default router 