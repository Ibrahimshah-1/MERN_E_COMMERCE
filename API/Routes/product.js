import express from 'express'
import { addProduct, deleteById, getProductById, getProductByIdAndUpdate, getProducts } from '../Controllers/product.js'
import { getAllUser } from '../Controllers/user.js'


const router = express.Router()

//add 
//:api api/product/add
//post

router.post('/add',addProduct)

//getallProducts
//api api/product/all
//get

router.get('/all',getProducts)


//getallProducts by id 
//api api/product/:id
//get

router.get('/:id',getProductById)

//getallProducts by id and update it 
//api api/product/:id
//put

router.put('/:id',getProductByIdAndUpdate)

// delete Products by id 
//api api/product/:id
//delete

router.delete('/:id',deleteById)



export default router